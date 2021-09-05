function generateCardListElement(cardList: IDeckCard[]) {
    let root: HTMLUListElement = document.createElement("ul");
    root.classList.add("card-deck");

    for (let card of cardList) {
        root.appendChild(generateCardElement(card));
    }

    return root;
}

function generateCardElement(card: IDeckCard): HTMLLIElement {
    let root: HTMLLIElement = document.createElement("li") as HTMLLIElement;
    root.setAttribute("data-dbfId", card.cardData.dbfId.toString());
    root.classList.add("card-frame");

    root.innerHTML = `
    <span class="card-cost">${card.cardData.cost}</span>
    <span class="card-name">${card.cardData.name}</span>
    <span class="card-quantity">${card.quantity}</span>
    <span class="card-art">
        <img src="https://art.hearthstonejson.com/v1/tiles/${card.cardData.id}.png" loading=lazy></img>
    </span>
    `

    return root;
}