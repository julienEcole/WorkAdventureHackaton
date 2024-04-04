/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
//import { parseCronExpression } from "cron-schedule";



let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(() => {
    WA.players.configureTracking();
    startGame()
    // placer les joueurs en dehors du carré vert
    WA.room.area.onEnter('greenZone').subscribe(()=>{
        WA.player.state.isReady = true;
        if(checkPlayers()){
            console.log("lancement de la popup")
            const buttonDescriptor = {
            id: "startButton",
            label: "Start",
            callback: () => {
                console.log('fermer')
                closePopup();
                startCountDown();
            }
        };
        currentPopup = WA.ui.openPopup("countDown","",[buttonDescriptor])
        }
    }
    )
    WA.room.area.onLeave('greenZone').subscribe(()=>{
        WA.player.state.isReady = false;
        console.log('is ready player ' + WA.player.state.isReady)
        console.log(checkPlayers())
        if(checkPlayers()){
            console.log("Tout les jouers sont prets")
        }else{
            console.log("Cerrtains  jouers sont pas prets")
        }
    });




    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));



function startGame(){
    WA.nav.goToRoom('lobby.tmj')
}

function closePopup(){
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

function checkPlayers(){
    const players = Array.from(WA.players.list());
    if(WA.player.state.isReady == false||players.length == 0){
        return false;
    }
    for (const player of players) {
        if(player.state.isReady == false ){
            return false;
        }
    }
    return true;
        
}

function startCountDown() {
    var secondsLeft = 10;
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


export {};

