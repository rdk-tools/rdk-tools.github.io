const possibleClasses = ["Demon Hunter", "Druid", "Hunter", "Mage", "Paladin", "Priest", "Rogue", "Shaman", "Warlock", "Warrior"];

enum Format {
    Wild = 1,
    Standard = 2,
    Classic = 3
}

class Deck {
    format: Format;
    heroClass: string;
    cards: ICard[];

    constructor(format: Format, heroClass: string, cards: ICard[]) {
        this.format = format;
        this.heroClass = heroClass;
        this.cards = cards;
    }

    toString(this: Deck): string {
        let res = `Format: ${Format[this.format]}, Class: ${this.heroClass}\n`;

        for (let i = 0; i < this.cards.length; i++) {
            res += `${this.cards[i].quantity}x ${this.cards[i].name} (${this.cards[i].id})<br>`;
        }

        return res;
    }

    static fromDeckString(deckString: string): Deck | null {
        try {
            let data = base64ToVarIntArray(deckString);
            assert(data.length > 5);

            console.log(data);
            let format: Format = data[2] as Format;
            assert(data[0] === 0 && data[1] === 1 && data[3] <= 3);

            let heroClass: string = capitalize(getFromDatabaseRaw(data[4])['cardClass']);
            if (heroClass === "Demonhunter")
                heroClass = "Demon Hunter"
            
            assert(possibleClasses.indexOf(heroClass) > -1);

            let currentBlock: number = 3;

            let heroes = data[currentBlock];
            assert(heroes === 1);
            currentBlock += heroes + 1;

            let singleCards = data[currentBlock];
            assert(typeof singleCards === "number");
            let cards: ICard[] = [];

            currentBlock++;

            for (let i = currentBlock; i < currentBlock + singleCards; i++) {
                cards.push(getFromDatabase(data[i], 1));
            }

            currentBlock = currentBlock + singleCards;

            let doubleCards = data[currentBlock];
            assert(typeof doubleCards === "number");
            currentBlock++;

            for (let i = currentBlock; i < currentBlock + doubleCards; i++) {
                cards.push(getFromDatabase(data[i], 2));
            }

            cards.sort((x, y) => x.cost - y.cost);
            return new Deck(format, heroClass, cards);
        } catch {
            return null;
        }
    }
}

interface ICard {
    id: string;
    dbfId: number;
    name: string;
    quantity: number;
    cost: number;
}


let database: any[];

function generateCardDiv(card: ICard): HTMLElement {
    return htmlToElement(
        `
        <li class="card-frame" data-dbfId="${card.dbfId}">
            <span class="card-cost">${card.cost}</span>
            <span class="card-name">${card.name}</span>
            <span class="card-quantity">${card.quantity}</span>
            <span class="card-art">
                <img src="https://art.hearthstonejson.com/v1/tiles/${card.id}.png" loading=lazy></img>
            </span>
        </li>
        `
    );
}

function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function htmlToElement(html: string): HTMLElement {
    let template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild as HTMLElement;
}

function base64ToVarIntArray(base64String: string): number[] {
    let binary = atob(base64String);

    let buffer: Uint8Array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        buffer[i] = binary.charCodeAt(i);
    }

    return decodeVarints(buffer);
}

function decodeVarints(array: Uint8Array): number[] {
    let resArr: number[] = [];
    let cur: number[] = [];

    let more = false;

    for (let i = 0; i < array.length; i++) {
        if (!more)
            cur = [];

        cur.push(array[i]);

        more = (array[i] & 0x80) > 0;

        if (!more)
            resArr.push(varintAsNumber(new Uint8Array(cur)));
    }

    return resArr;
}

function varintAsNumber(bytes: Uint8Array): number {
    let res = 0;

    for (let i = 0; i < bytes.length; i++) {
        res += (bytes[i] & 0x7F) << i * 7;
    }

    return res;
}

function rawToCard(rawData: {id: string, name: string, cost: number, dbfId: number}, quantity: number): ICard {
    return {
        id: rawData['id'],
        dbfId: rawData['dbfId'],
        quantity: quantity,
        name: rawData['name'] as string,
        cost: rawData['cost']
    };
}

function getFromDatabase(dbfId: number, quantity: number): ICard {
    return rawToCard(getFromDatabaseRaw(dbfId), quantity);
}

function getFromDatabaseRaw(id: number): any {
    let card = database.find(x => x['dbfId'] === id);

    if (card)
        return card;
    else
        return database.find(x => x['dbfId'] === 1748); // NOOOO Card
}

async function fetchDatabase() {
    console.log("Fetching database...");
    database = await (await fetch("https://api.hearthstonejson.com/v1/latest/enUS/cards.json")).json();
    console.log("Done!");

    let button: HTMLButtonElement = document.getElementById("load-button") as HTMLButtonElement;
    if (button)
        button.disabled = false;
    
}

function assert(condition: any, msg?: string): asserts condition {
    if (!condition) {
      throw new Error(msg);
    }
  }

fetchDatabase();