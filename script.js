const generateButton = document.querySelector("#generate-button");
const adventureCard = document.querySelector("#adventure-card");
const historyList = document.querySelector("#history-list");

const locations = [
    "The Afterhill",
    "The Isle of Gont",
    "Castle Zaroth",
    "The Dead Woods"
];

const problems = [
    "travelers have disappeared without leaving a trace",
    "a mysterious storm has trapped the nearby village",
    "an ancient door has appeared in the middle of town",
    "something is stealing supplies from passing merchants"
];

function chooseRandom(items){
    const index = Math.floor(Math.random() * items.length);
    return items[index]
}

generateButton.addEventListener("click", generateAdventure);

async function generateAdventure()
{
    const location = chooseRandom(locations);
    const problem = chooseRandom(problems);

    adventureCard.innerHTML = "<p>Generating adventure...</p>";

    try
    {
        const monster = await getMonster();
        const magicItem = await getMagicItem();
        const historyItem = document.createElement("li");
    

        historyItem.textContent = `${location} - ${problem}. Threat: ${monster.name}`;
        historyList.prepend(historyItem);

        adventureCard.innerHTML = `
            <p class="eyebrow">NEW ADVENTURE</p>
            <h2>${location}</h2>
            <p>A group of adventurers discovers that ${problem}.</p>
            <p><strong>Reward:</strong> ${magicItem.rarity.name} ${magicItem.name}</p>
            <p><strong>Details:</strong> ${magicItem.desc.join(" ")}</p>
            <p><strong>Threat:</strong> A CR ${monster.challenge_rating} ${monster.name}.</p>
        `;
    } catch (error)
    {
        adventureCard.innerHTML = `
        <p>Something went wrong while generating the adventure.</p>
        <p>Please try again.</p>
        `;

        console.error(error);
    }
    
}

async function getMonster(){
    const listResponse = await fetch("https://www.dnd5eapi.co/api/2014/monsters");

    if (!listResponse.ok) 
    {
        throw new Error("Unable to load monster data");
    }
    const monsterList = await listResponse.json();
    const randomMonster = chooseRandom(monsterList.results);

    const detailResponse = await fetch(`https://www.dnd5eapi.co${randomMonster.url}`);

    if (!detailResponse.ok)
    {
        throw new Error("Unable to load monster details");
    }

    return detailResponse.json();
}

async function getMagicItem()
{
    const listResponse = await fetch("https://www.dnd5eapi.co/api/2014/magic-items");

    if (!listResponse.ok)
    {
        throw new Error("Unable to load magic item list");
    }

    const itemList = await listResponse.json();
    const randomItem = chooseRandom(itemList.results);

    const detailResponse = await fetch(`https://www.dnd5eapi.co${randomItem.url}`);

    if (!detailResponse.ok)
    {
        throw new Error("Unable to load magic item details");
    }

    return detailResponse.json();
}