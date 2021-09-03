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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var possibleClasses = ["Demon Hunter", "Druid", "Hunter", "Mage", "Paladin", "Priest", "Rogue", "Shaman", "Warlock", "Warrior"];
var Format;
(function (Format) {
    Format[Format["Wild"] = 1] = "Wild";
    Format[Format["Standard"] = 2] = "Standard";
    Format[Format["Classic"] = 3] = "Classic";
})(Format || (Format = {}));
var Deck = /** @class */ (function () {
    function Deck(format, heroClass, cards) {
        this.format = format;
        this.heroClass = heroClass;
        this.cards = cards;
    }
    Deck.prototype.toString = function () {
        var res = "Format: " + Format[this.format] + ", Class: " + this.heroClass + "\n";
        for (var i = 0; i < this.cards.length; i++) {
            res += this.cards[i].quantity + "x " + this.cards[i].name + " (" + this.cards[i].id + ")<br>";
        }
        return res;
    };
    Deck.fromDeckString = function (deckString) {
        try {
            var data = base64ToVarIntArray(deckString);
            assert(data.length > 5);
            console.log(data);
            var format = data[2];
            assert(data[0] === 0 && data[1] === 1 && data[3] <= 3);
            var heroClass = capitalize(getFromDatabaseRaw(data[4])['cardClass']);
            if (heroClass === "Demonhunter")
                heroClass = "Demon Hunter";
            assert(possibleClasses.indexOf(heroClass) > -1);
            var currentBlock = 3;
            var heroes = data[currentBlock];
            assert(heroes === 1);
            currentBlock += heroes + 1;
            var singleCards = data[currentBlock];
            assert(typeof singleCards === "number");
            var cards = [];
            currentBlock++;
            for (var i = currentBlock; i < currentBlock + singleCards; i++) {
                cards.push(getFromDatabase(data[i], 1));
            }
            currentBlock = currentBlock + singleCards;
            var doubleCards = data[currentBlock];
            assert(typeof doubleCards === "number");
            currentBlock++;
            for (var i = currentBlock; i < currentBlock + doubleCards; i++) {
                cards.push(getFromDatabase(data[i], 2));
            }
            cards.sort(function (x, y) { return x.cost - y.cost; });
            return new Deck(format, heroClass, cards);
        }
        catch (_a) {
            return null;
        }
    };
    return Deck;
}());
var database;
function generateCardDiv(card) {
    return htmlToElement("\n        <li class=\"card-frame\" data-dbfId=\"" + card.dbfId + "\">\n            <span class=\"card-cost\">" + card.cost + "</span>\n            <span class=\"card-name\">" + card.name + "</span>\n            <span class=\"card-quantity\">" + card.quantity + "</span>\n            <span class=\"card-art\">\n                <img src=\"https://art.hearthstonejson.com/v1/tiles/" + card.id + ".png\" loading=lazy></img>\n            </span>\n        </li>\n        ");
}
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}
function base64ToVarIntArray(base64String) {
    var binary = atob(base64String);
    var buffer = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) {
        buffer[i] = binary.charCodeAt(i);
    }
    return decodeVarints(buffer);
}
function decodeVarints(array) {
    var resArr = [];
    var cur = [];
    var more = false;
    for (var i = 0; i < array.length; i++) {
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
    var res = 0;
    for (var i = 0; i < bytes.length; i++) {
        res += (bytes[i] & 0x7F) << i * 7;
    }
    return res;
}
function rawToCard(rawData, quantity) {
    return {
        id: rawData['id'],
        dbfId: rawData['dbfId'],
        quantity: quantity,
        name: rawData['name'],
        cost: rawData['cost']
    };
}
function getFromDatabase(dbfId, quantity) {
    return rawToCard(getFromDatabaseRaw(dbfId), quantity);
}
function getFromDatabaseRaw(id) {
    var card = database.find(function (x) { return x['dbfId'] === id; });
    if (card)
        return card;
    else
        return database.find(function (x) { return x['dbfId'] === 1748; }); // NOOOO Card
}
function fetchDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var button;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Fetching database...");
                    return [4 /*yield*/, fetch("https://api.hearthstonejson.com/v1/latest/enUS/cards.json")];
                case 1: return [4 /*yield*/, (_a.sent()).json()];
                case 2:
                    database = _a.sent();
                    console.log("Done!");
                    button = document.getElementById("load-button");
                    if (button)
                        button.disabled = false;
                    return [2 /*return*/];
            }
        });
    });
}
function assert(condition, msg) {
    if (!condition) {
        throw new Error(msg);
    }
}
fetchDatabase();
