// Represents a Banlist, i.e. a list of cards that aren't 
// allowed in a tournament.
interface IBanlist {
    isCardBanned(card: IDeckCard, deck: Deck): boolean;
}

class CardBasedBanlist implements IBanlist {
    bannedCardsDbfIds: Set<number>;
    
    constructor(bannedCardsDbfIds: number[]) {
        this.bannedCardsDbfIds = new Set(bannedCardsDbfIds);
    }

    isCardBanned(card: IDeckCard, deck: Deck): boolean {
        return this.bannedCardsDbfIds.has(card.cardData.dbfId);
    }
}

class SetBasedBanlist implements IBanlist {
    bannedSets: Set<string>;

    constructor(bannedSets: string[]) {
        this.bannedSets = new Set(bannedSets);
    }

    isCardBanned(card: IDeckCard, deck: Deck): boolean {
        return this.bannedSets.has(card.cardData.set);
    }
}

// Represents multiple banlists, divided only by class
class ClassBasedBanlist {
    cardBanlists: {[heroClass: string]: CardBasedBanlist};

    constructor(banlists: {[heroClass: string]: number[]}) {
        this.cardBanlists = {};

        for (let heroClass in banlists) {
            this.cardBanlists[heroClass] = new CardBasedBanlist(banlists[heroClass]);
        }
    }

    isCardBanned(card: IDeckCard, deck: Deck): boolean {
        if (!this.cardBanlists.hasOwnProperty(deck.heroClass))
            return false;
        return this.cardBanlists[deck.heroClass].isCardBanned(card, deck);
    }
}

// Represents a set of banlists, that will all be checked
// to return which cards are banned in a deck.
class BanlistCollection {
    banlists: IBanlist[];

    constructor(banlists: IBanlist[]) {
        this.banlists = banlists;
    }

    getBannedCards(deck: Deck): IDeckCard[] {
        let bannedCards: IDeckCard[] = []
        
        for (let card of deck.cards) {
            for (let banlist of this.banlists) {
                if (banlist.isCardBanned(card, deck)){
                    bannedCards.push(card);
                    break;
                }
            }
        }

        return bannedCards;
    }
}