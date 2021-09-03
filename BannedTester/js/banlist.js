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
var banlist = new Set();
function searchCard() {
    if (!database)
        return;
    var root = document.getElementById("search-bar");
    var searchArea = document.getElementById("search-query");
    var searchQuery = searchArea.value;
    root.innerHTML = "";
    var filteredCards = filterCards(searchQuery);
    for (var _i = 0, filteredCards_1 = filteredCards; _i < filteredCards_1.length; _i++) {
        var card = filteredCards_1[_i];
        var cardDiv = generateCardDiv(card);
        cardDiv.className += " clickable";
        cardDiv.onclick = function (ev) {
            var div = ev.target;
            while (div.className.indexOf("clickable") == -1 || !div.parentNode)
                div = div.parentNode;
            if (div.dataset.dbfid)
                addToBanlist(div.dataset.dbfid);
        };
        root.appendChild(cardDiv);
    }
}
function copyBanlistToClipboard() {
    return __awaiter(this, void 0, void 0, function () {
        var banlistString;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (banlist.size <= 0)
                        return [2 /*return*/];
                    banlistString = JSON.stringify(Array.from(banlist).map(function (x) { return parseInt(x); }));
                    return [4 /*yield*/, navigator.clipboard.writeText(banlistString)];
                case 1:
                    _a.sent();
                    document.getElementById("tooltip").className = "tooltip tooltip-clicked";
                    window.setTimeout(function () { return document.getElementById("tooltip").className = "tooltip tooltip-unclicked"; }, 1000);
                    console.log("Copied!");
                    return [2 /*return*/];
            }
        });
    });
}
function updateBanlist() {
    var banlistDiv = document.getElementById("banlist");
    banlistDiv.innerHTML = "";
    var banlistArr = Array.from(banlist);
    for (var _i = 0, banlistArr_1 = banlistArr; _i < banlistArr_1.length; _i++) {
        var cardId = banlistArr_1[_i];
        var id = parseInt(cardId.toString());
        var cardDiv = generateCardDiv(getFromDatabase(id, 1));
        cardDiv.className += " clickable";
        cardDiv.onclick = function (ev) {
            var div = ev.target;
            while (div.className.indexOf("clickable") == -1 || !div.parentNode)
                div = div.parentNode;
            if (div.dataset.dbfid)
                removeFromBanlist(div.dataset.dbfid);
        };
        banlistDiv.appendChild(cardDiv);
    }
}
function removeFromBanlist(dbfId) {
    var oldLen = banlist.size;
    banlist.delete(dbfId);
    if (banlist.size != oldLen) {
        updateBanlist();
        searchCard();
    }
}
function addToBanlist(dbfId) {
    var oldLen = banlist.size;
    banlist.add(dbfId);
    if (banlist.size != oldLen) {
        updateBanlist();
        searchCard();
    }
}
function filterCards(query) {
    var result = [];
    for (var _i = 0, database_1 = database; _i < database_1.length; _i++) {
        var card = database_1[_i];
        if ((card['name'].toLowerCase()).indexOf(query.toLowerCase()) >= 0 &&
            card['collectible'] &&
            !banlist.has(card['dbfId'].toString()) &&
            card['cost'] != undefined) {
            result.push(rawToCard(card, 1));
        }
        if (result.length > 10) {
            break;
        }
    }
    return result;
}
