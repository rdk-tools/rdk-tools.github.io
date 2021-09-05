"use strict";
class CardBasedBanlist {
    constructor(bannedCardsDbfIds) {
        this.bannedCardsDbfIds = new Set(bannedCardsDbfIds);
    }
    isCardBanned(card, deck) {
        return this.bannedCardsDbfIds.has(card.cardData.dbfId);
    }
}
class SetBasedBanlist {
    constructor(bannedSets) {
        this.bannedSets = new Set(bannedSets);
    }
    isCardBanned(card, deck) {
        return this.bannedSets.has(card.cardData.set);
    }
}
// Represents multiple banlists, divided only by class
class ClassBasedBanlist {
    constructor(banlists) {
        this.cardBanlists = {};
        for (let heroClass in banlists) {
            this.cardBanlists[heroClass] = new CardBasedBanlist(banlists[heroClass]);
        }
    }
    isCardBanned(card, deck) {
        if (!this.cardBanlists.hasOwnProperty(deck.heroClass))
            return false;
        return this.cardBanlists[deck.heroClass].isCardBanned(card, deck);
    }
}
// Represents a set of banlists, that will all be checked
// to return which cards are banned in a deck.
class BanlistCollection {
    constructor(banlists) {
        this.banlists = banlists;
    }
    getBannedCards(deck) {
        let bannedCards = [];
        for (let card of deck.cards) {
            for (let banlist of this.banlists) {
                if (banlist.isCardBanned(card, deck)) {
                    bannedCards.push(card);
                    break;
                }
            }
        }
        return bannedCards;
    }
}
