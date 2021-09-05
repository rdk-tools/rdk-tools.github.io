"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Enums
var HeroClass;
(function (HeroClass) {
    HeroClass["DemonHunter"] = "DEMONHUNTER";
    HeroClass["Druid"] = "DRUID";
    HeroClass["Hunter"] = "HUNTER";
    HeroClass["Mage"] = "MAGE";
    HeroClass["Paladin"] = "PALADIN";
    HeroClass["Priest"] = "PRIEST";
    HeroClass["Rogue"] = "ROGUE";
    HeroClass["Shaman"] = "SHAMAN";
    HeroClass["Warlock"] = "WARLOCK";
    HeroClass["Warrior"] = "WARRIOR";
    // Weird classes
    HeroClass["Whizbang"] = "WHIZBANG";
    HeroClass["Dream"] = "DREAM";
    HeroClass["DeathKnight"] = "DEATHKNIGHT";
})(HeroClass || (HeroClass = {}));
var FormatType;
(function (FormatType) {
    FormatType[FormatType["Wild"] = 1] = "Wild";
    FormatType[FormatType["Standard"] = 2] = "Standard";
    FormatType[FormatType["Classic"] = 3] = "Classic";
})(FormatType || (FormatType = {}));
// Utilities
// Used to decode varint arrays
// Varint documentation: https://developers.google.com/protocol-buffers/docs/encoding
var VarintConverter;
(function (VarintConverter) {
    function decodeBase64VarintArray(base64String) {
        let binary = atob(base64String);
        let buffer = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            buffer[i] = binary.charCodeAt(i);
        }
        return decodeVarints(buffer);
    }
    VarintConverter.decodeBase64VarintArray = decodeBase64VarintArray;
    function decodeVarints(array) {
        let resArr = [];
        let cur = [];
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
    function varintAsNumber(bytes) {
        let res = 0;
        for (let i = 0; i < bytes.length; i++) {
            res += (bytes[i] & 0x7F) << i * 7;
        }
        return res;
    }
})(VarintConverter || (VarintConverter = {}));
// Manages the card database. 
// Must be loaded first with loadDatabase
// TODO: Implement local database loading
var CardDatabase;
(function (CardDatabase) {
    let database = {};
    const fallbackCardId = 1748; // NOOOO card
    function loadDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            let rawDatabase = yield (yield fetch("https://api.hearthstonejson.com/v1/latest/enUS/cards.json")).json();
            for (let entry of rawDatabase) {
                let data = {
                    id: entry["id"],
                    dbfId: entry["dbfId"],
                    name: entry["name"],
                    cost: entry["cost"],
                    cardClass: entry["cardClass"],
                    set: entry["set"]
                };
                database[data.dbfId] = data;
            }
        });
    }
    CardDatabase.loadDatabase = loadDatabase;
    function getCard(dbfId) {
        if (database === {})
            throw new Error("Card database should be loaded first.");
        if (database.hasOwnProperty(dbfId))
            return database[dbfId];
        else
            return database[fallbackCardId];
    }
    CardDatabase.getCard = getCard;
})(CardDatabase || (CardDatabase = {}));
// Represents a deck of hearthstone cards.
// Can be constructed directly from card data, or from a deckstring.
class Deck {
    constructor(format, heroClass, cards) {
        this.format = format;
        this.heroClass = heroClass;
        this.cards = cards;
    }
    toString() {
        let res = `Format: ${FormatType[this.format]}, Class: ${this.heroClass}\n`;
        for (let card of this.cards) {
            res += `${card.quantity}x ${card.cardData.name} (${card.cardData.id})\n`;
        }
        return res;
    }
    // Deckstring documentation: https://hearthsim.info/docs/deckstrings/
    static fromDeckString(deckString) {
        let assert = (x) => {
            if (!x)
                throw Error();
        };
        try {
            let data = VarintConverter.decodeBase64VarintArray(deckString);
            assert(data.length > 5);
            // First byte should always be 0
            // Second byte is the version, should always be 1
            assert(data[0] === 0 && data[1] === 1);
            let format = data[2];
            let currentBlock = 3;
            // Hero Block
            let heroes = data[currentBlock];
            // This only supports one hero in deck
            assert(heroes === 1);
            let heroCard = CardDatabase.getCard(data[currentBlock + 1]);
            let heroClass = heroCard.cardClass;
            currentBlock += heroes + 1;
            let cards = [];
            // Single Cards Block
            let singleCards = data[currentBlock];
            assert(typeof singleCards === "number");
            currentBlock++;
            for (let i = currentBlock; i < currentBlock + singleCards; i++) {
                let cardData = CardDatabase.getCard(data[i]);
                cards.push({ "quantity": 1, "cardData": cardData });
            }
            currentBlock = currentBlock + singleCards;
            // Double Cards Block
            let doubleCards = data[currentBlock];
            assert(typeof doubleCards === "number");
            currentBlock++;
            for (let i = currentBlock; i < currentBlock + doubleCards; i++) {
                let cardData = CardDatabase.getCard(data[i]);
                cards.push({ "quantity": 2, "cardData": cardData });
            }
            // TODO: Implement the "More than two cards" Block 
            // Sort by cost
            cards.sort((x, y) => x.cardData.cost - y.cardData.cost);
            return new Deck(format, heroClass, cards);
        }
        catch (_a) {
            return null;
        }
    }
}
