let banlist = new Set();

function searchCard() {
    if (!database)
        return;

    let root = document.getElementById("search-bar") as HTMLUListElement;
    let searchArea = document.getElementById("search-query") as HTMLElement | any;
    let searchQuery = searchArea.value;

    root.innerHTML = "";
    let filteredCards = filterCards(searchQuery);

    for (let card of filteredCards) {
        let cardDiv = generateCardDiv(card);
        cardDiv.className += " clickable";

        cardDiv.onclick = (ev) => {
            let div: HTMLElement | any = ev.target as HTMLElement | any;
            while (div.className.indexOf("clickable") == -1 || !div.parentNode)
                div = div.parentNode;

            if (div.dataset.dbfid)
                addToBanlist(div.dataset.dbfid)
        };
        root.appendChild(cardDiv);
    }
}

async function copyBanlistToClipboard(){
    if (banlist.size <= 0) return;

    let banlistString = JSON.stringify(Array.from(banlist).map(x => parseInt(x as string)));

    await navigator.clipboard.writeText(banlistString);

    (document.getElementById("tooltip") as HTMLElement).className = "tooltip tooltip-clicked"

    window.setTimeout(() => (document.getElementById("tooltip") as HTMLElement).className = "tooltip tooltip-unclicked", 1000);

    console.log("Copied!");
}

function updateBanlist() {
    let banlistDiv = document.getElementById("banlist") as HTMLUListElement;
    banlistDiv.innerHTML = "";
    let banlistArr = Array.from(banlist) as string[];

    for (let cardId of banlistArr) {
        let id = parseInt(cardId.toString());
        let cardDiv = generateCardDiv(getFromDatabase(id, 1));
        cardDiv.className += " clickable";

        cardDiv.onclick = (ev) => {
            let div: HTMLElement | any = ev.target as HTMLElement | any;
            while (div.className.indexOf("clickable") == -1 || !div.parentNode)
                div = div.parentNode;

            if (div.dataset.dbfid)
                removeFromBanlist(div.dataset.dbfid)
        };

        banlistDiv.appendChild(cardDiv);
    }
}

function removeFromBanlist(dbfId: number) {
    let oldLen = banlist.size;
    banlist.delete(dbfId);
    if (banlist.size != oldLen) {
        updateBanlist();
        searchCard();
    }
}

function addToBanlist(dbfId: number) {
    let oldLen = banlist.size;
    banlist.add(dbfId);
    if (banlist.size != oldLen) {
        updateBanlist();
        searchCard();
    }
}

function filterCards(query: string): ICard[] {
    let result: ICard[] = [];

    for (let card of database) {
        if (
            (card['name'].toLowerCase()).indexOf(query.toLowerCase()) >= 0 && 
            card['collectible'] && 
            !banlist.has(card['dbfId'].toString()) &&
            card['cost'] != undefined
        ){
            result.push(rawToCard(card, 1));
        }
        if (result.length > 10){
            break;
        }
    }

    return result;
}