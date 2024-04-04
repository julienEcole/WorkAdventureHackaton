/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";




let currentPopup: any = undefined;
let interval:any = undefined;

WA.onInit().then(() => {
    WA.players.configureTracking();
    
    //    startGame();
        //gameStarted = true;
    

    listenOnGreenZone();
    listenOnPlayers();

    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));



/*function startGame(){
    WA.nav.goToRoom('lobby.tmj')
}*/

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
    interval = setInterval(() => {
        closePopup();
        console.log('test')
        currentPopup = WA.ui.openPopup("countDown", secondsLeft + " seconds", []);
        secondsLeft--;
        if (secondsLeft < 0) {
            clearInterval(interval);
            closePopup();
            WA.event.broadcast("started",null)
        }
    }, 1000);
}



function listenOnPlayers(){
    WA.event.on("started").subscribe(() => {
        WA.nav.goToRoom('map.tmj');
    });
}

function listenOnGreenZone(){
    WA.room.area.onEnter('greenZone').subscribe(()=>{
        WA.player.state.isReady = true;
        if(checkPlayers()){
            console.log("lancement de la popup")
            closePopup();
            const buttonDescriptor = {
            id: "startButton",
            label: "Start",
            callback: () => {
                console.log('fermer')
                closePopup();
                startCountDown();
            }
        };
        currentPopup = WA.ui.openPopup("countDown","Lancer la partie ?",[buttonDescriptor])
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
            closePopup();
            clearInterval(interval);
        }
    });

}

export {};

