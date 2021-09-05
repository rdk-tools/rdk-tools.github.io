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
// import { CardDatabase, Deck } from "./hearthstone";
const testDeck = "AAECAZICArrhA+TuAw7lugPmugPougPvugObzgPw1AOJ4AOK4AOk4QPR4QOM5AOk9gOunwTanwQA";
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        let p = document.getElementById("test");
        if (p === null)
            return;
        yield CardDatabase.loadDatabase();
        console.log("Loaded!");
        let deck = Deck.fromDeckString(testDeck);
        if (deck) {
            let testClassBanlist = new ClassBasedBanlist(rawBanlistTest);
            let setBanList = new SetBasedBanlist(["THE_BARRENS"]);
            let banlistCollection = new BanlistCollection([testClassBanlist, setBanList]);
            p.appendChild(generateCardListElement(deck.cards));
        }
    });
}
const rawBanlistTest = {
    "DEMONHUNTER": [58487, 69586, 61127, 56928, 61968, 61898, 61135, 559, 66176, 48158],
    "DRUID": [55035, 60016, 59705, 59029, 59001, 40465, 53551, 52438, 63027, 61964, 56687, 42656, 43417, 59450, 42759],
    "HUNTER": [59705, 59394, 55301, 59170, 56482, 55291, 53756, 63591, 55303, 62812],
    "MAGE": [40299, 41168, 53822, 69702, 41153, 61957, 59639, 39767, 70048, 614, 43407, 2275, 192, 69911, 61584, 2883, 61589, 43419],
    "PALADIN": [61969, 40567, 1940, 62926, 61188, 679, 69932, 62927, 43384, 48764, 48989, 59587, 2028, 49184, 48158, 56554],
    "PRIEST": [59223, 41169, 61944, 61282, 52438, 42597, 40408, 50071, 42804, 43408],
    "ROGUE": [47035, 40465, 58794, 56377, 41222, 61151, 61953, 1016, 69830, 878, 70086, 48158],
    "SHAMAN": [60016, 2890, 61969, 40694, 63272, 1063, 69959, 47693, 3007, 48111],
    "WARLOCK": [59223, 69636, 1090, 69923, 43122, 54429, 49423, 61648, 56523, 53885, 56534, 61944, 56502, 1806, 45195, 2883, 61646, 43415],
    "WARRIOR": [40465, 69639, 596, 69950, 61953, 61235, 2043, 55006, 56504, 38920, 59101, 55000, 55004, 878, 70086, 56510, 559, 69852, 48158]
};
window.onload = test;