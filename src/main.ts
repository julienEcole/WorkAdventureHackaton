/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');
var screamSound = WA.sound.loadSound("../public/sounds/scream.ogg");
let currentPopup: any = undefined;

let nearbyPlayer = null;

// Waiting for the API to be ready
WA.onInit().then(async () => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)

    WA.room.area.onEnter('clock').subscribe(() => {
        //const today = new Date();
        //const time = today.getHours() + ":" + today.getMinutes();
        const buttonDescriptor = {
            id: "startButton",
            label: "Start",
            callback: () => {
                closePopup();
               WA.nav.openCoWebSite('chifomi.html' )
            }
        };
        
        currentPopup = WA.ui.openPopup("clockPopup", "", [buttonDescriptor]);
        
    })

    
    
    WA.room.area.onLeave('clock').subscribe(closePopup);
    

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));
    if(WA.player.name == "padchans") {WA.player.state.dead = true;}
    
    if(WA.player.state.dead==true)  WA.player.setOutlineColor(255, 0, 0) ;
    
    
    await WA.players.configureTracking();

    WA.event.on('player-killed').subscribe(async ( { data: { killedPlayerId } }) => {
        console.log(`Killed player: ${killedPlayerId }`);
        if (WA.player.playerId === killedPlayerId) {
            const position = await WA.player.getPosition();
            WA.player.state.dead = true;
            WA.player.setOutlineColor(255, 0, 0);
            
            WA.room.setTiles([
        
                {x:Number(position.x) , y: Number(position.y), tile: "deathAnimation", layer: "floorLayer"},
            ]);
            WA.player.teleport(786,296);
            WA.controls.disablePlayerControls()
          
            
        }
    });









}).catch(e => console.error(e));




function closePopup(){
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

WA.player.onPlayerMove(addKillButton);
WA.player.onPlayerMove(removeKillButton);

WA.player.onPlayerMove(removeKillButton);
//WA.player.onPlayerMove(bloquedPlayer);

function bloquedPlayer(){
    if (WA.player.state.dead==true) WA.player.teleport(786,296);
}

async function addKillButton(){
    

    await WA.players.configureTracking();
    const players = WA.players.list();
    for (const otherPlayer of players) {
        const position1 = await WA.player.getPosition();
        const position2 =  otherPlayer.position;

        if (Math.sqrt((position1.x - position2.x)**2 + (position1.y - position2.y)**2) < 60 && otherPlayer.state.dead!=true) {
            WA.ui.actionBar.addButton({
                id: 'kill-btn',
                label: `Tuer ${otherPlayer.name}`,
                callback: (event) => {
                    console.log('Button clicked', event);
                    WA.event.broadcast('player-killed', { killedPlayerId: otherPlayer.playerId });
                    screamSound.play(config);
                    
                }
            });
        }
    }
}
async function  removeKillButton(){
    await WA.players.configureTracking();
    const players = WA.players.list();
    for (const otherPlayer of players) {
       
        const position1 = await WA.player.getPosition();
        const position2 =  otherPlayer.position;

        if (Math.sqrt((position1.x - position2.x)**2 + (position1.y - position2.y)**2) > 60) {
            WA.ui.actionBar.removeButton('kill-btn');
           
        }
}}




function setDeathAnimation(xCoordinate: number,yCoordinate: number) {
    console.log("test animation")
    WA.room.setTiles([
        
        {x:Number(xCoordinate) , y: Number(yCoordinate), tile: "deathAnimation", layer: "floorlayer"},
    ]);
}



function chifoumi(){

    
}
   
export {};
