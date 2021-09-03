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
var deckStringTextArea = document.getElementById("deck-string");
function loadDeck() {
    return __awaiter(this, void 0, void 0, function () {
        var root, rawDeckString, deckString, _i, _a, line, cardDeck, list, _b, _c, card, deckContainer, deckLabel, bannedCardsContainer, bannedLabel, bannedList, banlist_1, bannedCards, _d, _e, card, inBannedSet, _f, bannedSets_1, set, noBannedLabel, _g, bannedCards_1, card, errorLabel;
        return __generator(this, function (_h) {
            root = document.getElementById("app");
            root.innerHTML = "";
            rawDeckString = deckStringTextArea.value;
            deckString = "";
            for (_i = 0, _a = rawDeckString.split("\n"); _i < _a.length; _i++) {
                line = _a[_i];
                if (line && line.indexOf("#") == -1)
                    deckString += line;
            }
            cardDeck = Deck.fromDeckString(deckString);
            if (cardDeck) {
                list = document.createElement("ul");
                list.className = "card-deck";
                for (_b = 0, _c = cardDeck.cards; _b < _c.length; _b++) {
                    card = _c[_b];
                    list.appendChild(generateCardDiv(card));
                }
                deckContainer = document.createElement("div");
                deckContainer.className = "six columns";
                deckLabel = document.createElement("label");
                deckLabel.textContent = "Deck:";
                deckContainer.appendChild(deckLabel);
                deckContainer.appendChild(list);
                root.appendChild(deckContainer);
                bannedCardsContainer = document.createElement("div");
                bannedCardsContainer.className = "six columns";
                bannedLabel = document.createElement("label");
                bannedLabel.textContent = "Banned Cards: ";
                bannedList = document.createElement("ul");
                bannedList.className = "card-deck";
                banlist_1 = banlistDictionary[cardDeck.heroClass];
                bannedCards = [];
                for (_d = 0, _e = cardDeck.cards; _d < _e.length; _d++) {
                    card = _e[_d];
                    inBannedSet = false;
                    for (_f = 0, bannedSets_1 = bannedSets; _f < bannedSets_1.length; _f++) {
                        set = bannedSets_1[_f];
                        if (card.id.indexOf(set) > -1) {
                            inBannedSet = true;
                            break;
                        }
                    }
                    if (inBannedSet || banlist_1.indexOf(card.dbfId) > -1)
                        bannedCards.push(card);
                }
                if (bannedCards.length == 0) {
                    noBannedLabel = document.createElement("label");
                    noBannedLabel.textContent = "No banned cards.";
                    noBannedLabel.className = "no-banned";
                    bannedCardsContainer.appendChild(noBannedLabel);
                }
                else {
                    for (_g = 0, bannedCards_1 = bannedCards; _g < bannedCards_1.length; _g++) {
                        card = bannedCards_1[_g];
                        bannedList.appendChild(generateCardDiv(card));
                    }
                    bannedCardsContainer.appendChild(bannedLabel);
                    bannedCardsContainer.appendChild(bannedList);
                }
                root.appendChild(bannedCardsContainer);
            }
            else {
                errorLabel = document.createElement("label");
                errorLabel.textContent = "Invalid deck string.";
                errorLabel.className = "error-message";
                root.appendChild(errorLabel);
            }
            return [2 /*return*/];
        });
    });
}
var bannedSets = [
    "WC"
];
var banlistDictionary = {
    "Demon Hunter": [58487, 69586, 61127, 56928, 61968, 61898, 61135, 559, 66176, 48158],
    "Druid": [55035, 60016, 59705, 59029, 59001, 40465, 53551, 52438, 63027, 61964, 56687, 42656, 43417, 59450, 42759],
    "Hunter": [59705, 59394, 55301, 59170, 56482, 55291, 53756, 63591, 55303, 62812],
    "Mage": [40299, 41168, 53822, 69702, 41153, 61957, 59639, 39767, 70048, 614, 43407, 2275, 192, 69911, 61584, 2883, 61589, 43419],
    "Paladin": [61969, 40567, 1940, 62926, 61188, 679, 69932, 62927, 43384, 48764, 48989, 59587, 2028, 49184, 48158, 56554],
    "Priest": [59223, 41169, 61944, 61282, 52438, 42597, 40408, 50071, 42804, 43408],
    "Rogue": [47035, 40465, 58794, 56377, 41222, 61151, 61953, 1016, 69830, 878, 70086, 48158],
    "Shaman": [60016, 2890, 61969, 40694, 63272, 1063, 69959, 47693, 3007, 48111],
    "Warlock": [59223, 69636, 1090, 69923, 43122, 54429, 49423, 61648, 56523, 53885, 56534, 61944, 56502, 1806, 45195, 2883, 61646, 43415],
    "Warrior": [40465, 69639, 596, 69950, 61953, 61235, 2043, 55006, 56504, 38920, 59101, 55000, 55004, 878, 70086, 56510, 559, 69852, 48158]
};
