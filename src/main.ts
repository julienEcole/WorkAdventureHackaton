/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');


let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)

    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        const buttonDescriptor = {
            id: "startButton",
            label: "Start",
            callback: () => {
                closePopup();
                currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
                
            }
        };
        
        currentPopup = WA.ui.openPopup("clockPopup", "", [buttonDescriptor]);
        
    })

    
    
    WA.room.area.onLeave('clock').subscribe(closePopup);
    

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));



}).catch(e => console.error(e));

function closePopup(){
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

function chifoumi(){

    const choices = ["Rock", "Paper", "Scissors"];
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    console.log(computerChoice);

    const popupContent = `
    <div>
        <p>Choose your move:</p>
        <button onclick="playGame('Rock')">Rock</button>
        <button onclick="playGame('Paper')">Paper</button>
        <button onclick="playGame('Scissors')">Scissors</button>
    </div>
`;

// Open the popup with the game options
currentPopup = WA.ui.openPopup("clockPopup", popupContent, []);
}
export {};
