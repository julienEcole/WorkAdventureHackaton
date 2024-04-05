/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');


let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)

    WA.room.area.onEnter('clock').subscribe(() => {
        const buttonDescriptor = {
            id: "startButton",
            label: "Start",
            callback: async () => {
                closePopup();
                //WA.controls.disablePlayerControls();
                const coWebsite = await WA.nav.openCoWebSite('codeWorking.html', true );
                //WA.controls.restorePlayerControls()
                //coWebsite.close()
            }
        };
        
        currentPopup = WA.ui.openPopup("clockPopup", "", [buttonDescriptor]);
        
        function startCountDown() {
            let secondsLeft = 10;
            const interval = setInterval(() => {
                closePopup();
                console.log('test')
                currentPopup = WA.ui.openPopup("clockPopup", secondsLeft + " seconds", []);
                secondsLeft--;
                if (secondsLeft < 0) {
                    clearInterval(interval);
                    closePopup();
                }
            }, 1000);
        }
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


export {};
