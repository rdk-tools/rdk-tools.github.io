// Enums
enum HeroClass {
    DemonHunter = "DEMONHUNTER",
    Druid = "DRUID",
    Hunter = "HUNTER",
    Mage = "MAGE",
    Paladin = "PALADIN",
    Priest = "PRIEST",
    Rogue = "ROGUE",
    Shaman = "SHAMAN",
    Warlock = "WARLOCK",
    Warrior = "WARRIOR",

    // Weird classes
    Whizbang = "WHIZBANG",
    Dream = "DREAM",
    DeathKnight = "DEATHKNIGHT"
}

enum FormatType {
    Wild = 1,
    Standard = 2,
    Classic = 3
}

// Interfaces
interface ICardData {
    id: string;
    dbfId: number;
    name: string;
    cost: number;
    cardClass: string;
    set: string;
}

interface IDeckCard {
    quantity: number;
    cardData: ICardData;
}

// Utilities

// Used to decode varint arrays
// Varint documentation: https://developers.google.com/protocol-buffers/docs/encoding
module VarintConverter {
    export function decodeBase64VarintArray(base64String: string): number[] {
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
}

// Manages the card database. 
// Must be loaded first with loadDatabase
// TODO: Implement local database loading
module CardDatabase {
    let database: {[key: number]: ICardData} = {};
    const fallbackCardId: number = 1748; // NOOOO card

    export async function loadDatabase() {
        let rawDatabase = await (await fetch("https://api.hearthstonejson.com/v1/latest/enUS/cards.json")).json();

        for (let entry of rawDatabase) {
            let data: ICardData = {
                id: entry["id"],
                dbfId: entry["dbfId"],
                name: entry["name"] as string,
                cost: entry["cost"],
                cardClass: entry["cardClass"] as string,
                set: entry["set"] as string
            }

            database[data.dbfId] = data;
        }
    }


    export function getCard(dbfId: number): ICardData {
        if (database === {})
            throw new Error("Card database should be loaded first.");

        if (database.hasOwnProperty(dbfId))
            return database[dbfId];
        else
            return database[fallbackCardId];
    }
}

// Represents a deck of hearthstone cards.
// Can be constructed directly from card data, or from a deckstring.
class Deck {
    format: FormatType;
    heroClass: HeroClass;
    cards: IDeckCard[];

    constructor(format: FormatType, heroClass: HeroClass, cards: IDeckCard[]) {
        this.format = format;
        this.heroClass = heroClass;
        this.cards = cards;
    }

    toString(this: Deck): string {
        let res = `Format: ${FormatType[this.format]}, Class: ${this.heroClass}\n`;

        for (let card of this.cards) {
            res += `${card.quantity}x ${card.cardData.name} (${card.cardData.id})\n`;
        }

        return res;
    }

    // Deckstring documentation: https://hearthsim.info/docs/deckstrings/
    static fromDeckString(deckString: string): Deck | null {
        let assert = (x: boolean) => {
            if (!x) throw Error();
        }

        try {
            let data = VarintConverter.decodeBase64VarintArray(deckString);
            assert(data.length > 5);

            // First byte should always be 0
            // Second byte is the version, should always be 1
            assert(data[0] === 0 && data[1] === 1);

            let format: FormatType = data[2] as FormatType;

            let currentBlock: number = 3;

            // Hero Block
            let heroes = data[currentBlock];
            // This only supports one hero in deck
            assert(heroes === 1);

            let heroCard = CardDatabase.getCard(data[currentBlock + 1]);
            let heroClass = heroCard.cardClass as HeroClass;

            currentBlock += heroes + 1;

            let cards: IDeckCard[] = [];

            // Single Cards Block
            let singleCards = data[currentBlock];
            assert(typeof singleCards === "number");

            currentBlock++;

            for (let i = currentBlock; i < currentBlock + singleCards; i++) {
                let cardData = CardDatabase.getCard(data[i]);
                cards.push({"quantity": 1, "cardData": cardData});
            }

            currentBlock = currentBlock + singleCards;

            // Double Cards Block
            let doubleCards = data[currentBlock];
            assert(typeof doubleCards === "number");

            currentBlock++;

            for (let i = currentBlock; i < currentBlock + doubleCards; i++) {
                let cardData = CardDatabase.getCard(data[i]);
                cards.push({"quantity": 2, "cardData": cardData});
            }

            // TODO: Implement the "More than two cards" Block 

            // Sort by cost
            cards.sort((x, y) => x.cardData.cost - y.cardData.cost);
            

            return new Deck(format, heroClass, cards);
        } catch {
            return null;
        }
    }
}