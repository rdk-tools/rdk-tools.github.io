const deckStringTextArea: HTMLElement | any = document.getElementById("deck-string");

async function loadDeck() {
    let root = document.getElementById("app") as HTMLElement;
    root.innerHTML = "";
    let rawDeckString = deckStringTextArea.value;
    let deckString = "";

    for (let line of rawDeckString.split("\n")) {
        if (line && line.indexOf("#") == -1)
            deckString += line;
    }

    let cardDeck = Deck.fromDeckString(deckString);

    if (cardDeck) {
        let list: HTMLUListElement = document.createElement("ul");
        list.className = "card-deck";

        for (let card of cardDeck.cards) {
            list.appendChild(generateCardDiv(card));
        }

        let deckContainer = document.createElement("div");
        deckContainer.className = "six columns";
        let deckLabel = document.createElement("label");
        deckLabel.textContent = "Deck:";

        deckContainer.appendChild(deckLabel);
        deckContainer.appendChild(list);

        root.appendChild(deckContainer);


        let bannedCardsContainer = document.createElement("div");
        bannedCardsContainer.className = "six columns";
        let bannedLabel = document.createElement("label");
        bannedLabel.textContent = "Banned Cards: ";
        
        let bannedList: HTMLUListElement = document.createElement("ul");
        bannedList.className = "card-deck";

        let banlist = banlistDictionary[cardDeck.heroClass];

        let bannedCards: ICard[] = [];
        for (let card of cardDeck.cards) {
            let inBannedSet = false;

            for (let set of bannedSets) {
                if (card.id.indexOf(set) > -1) {
                    inBannedSet = true;
                    break;
                }
            }


            if (inBannedSet || banlist.indexOf(card.dbfId) > -1) 
                bannedCards.push(card);
        }

        if (bannedCards.length == 0) {
            let noBannedLabel = document.createElement("label");
            noBannedLabel.textContent = "No banned cards.";
            noBannedLabel.className = "no-banned";

            bannedCardsContainer.appendChild(noBannedLabel);

        }else {
            for (let card of bannedCards) {
                bannedList.appendChild(generateCardDiv(card));
            }
        
            bannedCardsContainer.appendChild(bannedLabel);
            bannedCardsContainer.appendChild(bannedList);
        }
        

        root.appendChild(bannedCardsContainer);
    } else {
        let errorLabel = document.createElement("label");

        errorLabel.textContent = "Invalid deck string.";
        errorLabel.className = "error-message";
        root.appendChild(errorLabel);
    }

    
}

let bannedSets: string[] = [
    "WC"
]; 

let banlistDictionary: {[key: string]: number[]} = {
    "Demon Hunter":  [58487,69586,61127,56928,61968,61898,61135,559,66176,48158],
    "Druid":         [55035,60016,59705,59029,59001,40465,53551,52438,63027,61964,56687,42656,43417,59450,42759],
    "Hunter":        [59705,59394,55301,59170,56482,55291,53756,63591,55303,62812],
    "Mage":          [40299,41168,53822,69702,41153,61957,59639,39767,70048,614,43407,2275,192,69911,61584,2883,61589,43419],
    "Paladin":       [61969,40567,1940,62926,61188,679,69932,62927,43384,48764,48989,59587,2028,49184,48158,56554],
    "Priest":        [59223,41169,61944,61282,52438,42597,40408,50071,42804,43408],
    "Rogue":         [47035,40465,58794,56377,41222,61151,61953,1016,69830,878,70086,48158],
    "Shaman":        [60016,2890,61969,40694,63272,1063,69959,47693,3007,48111],
    "Warlock":       [59223,69636,1090,69923,43122,54429,49423,61648,56523,53885,56534,61944,56502,1806,45195,2883,61646,43415],
    "Warrior":       [40465,69639,596,69950,61953,61235,2043,55006,56504,38920,59101,55000,55004,878,70086,56510,559,69852,48158]
}