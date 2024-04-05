/// <reference types="@workadventure/iframe-api-typings" />

import {bootstrapExtra} from "@workadventure/scripting-api-extra";
import { Impostor, Player } from "./class/Player";

console.log('Script started successfully');
var screamSound = WA.sound.loadSound("../public/sounds/scream.ogg");
let mapName: string | undefined = ""
var killingPossibility: boolean = false;
var isPoped : boolean = false;


let currentPopup: any = undefined;
let interval: any = undefined;
// Waiting for the API to be ready
WA.onInit().then(async () => {
    console.log('Scripting API ready');
    console.log('Player tags: ', WA.player.tags)

    


    var thePlayer : Player = new Player("titi")
    
    var Other : Player = new Player("toto")

    var monImpo : Impostor = new Impostor("sus", [thePlayer, Other])

    WA.player.state.isKiller = isKiller()


    let currentPopup: any = undefined;

    

    listenOnGreenZone();


    listenOnPlayers();
    listenForCountDown();
    WA.room.area.onEnter('clock').subscribe(() => {
        const buttonDescriptor = {
            id: "startButton",
            label: "Start",
            callback: async () => {
                closePopup();
                //WA.controls.disablePlayerControls();
                const coWebsite = await WA.nav.openCoWebSite('codeWorking.html', true);
                WA.controls.disablePlayerControls();
                const otherCoWebsite = await WA.nav.openCoWebSite('chifomi.html', true);
                WA.controls.disablePlayerControls();
                closePopup();
            }

        };

        // const today = new Date();
        // const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "\n\nVos taches sont :\n" + monImpo.tacheToString(), []);
        
        currentPopup = WA.ui.openPopup("clockPopup", "", [buttonDescriptor]);
    })


    WA.room.area.onLeave('clock').subscribe(closePopup);


    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));
    if (WA.player.name == "padchans") {
        WA.player.state.dead = true;
    }

    if (WA.player.state.dead == true) await WA.player.setOutlineColor(255, 0, 0);


    await WA.players.configureTracking();

    WA.event.on('player-killed').subscribe(async ({data: {killedPlayerId}}) => {
        console.log(`Killed player: ${killedPlayerId}`);
        if (WA.player.playerId === killedPlayerId) {
            WA.player.state.dead = true;
            await WA.player.setOutlineColor(255, 0, 0);
            console.log("hello i don't understandz")
            await WA.player.teleport(3000, 296);
            WA.camera.followPlayer(false);
            WA.camera.set(900,900);


        }
    });

}).catch(e => console.error(e));

function closePopup() {
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

WA.player.onPlayerMove(addKillButton);

WA.player.onPlayerMove(removeKillButton);

//WA.player.onPlayerMove(bloquedPlayer);
async function addKillButton() {
    mapName = extractLastSegmentFromUrl(WA.room.mapURL);
    var killer = await WA.player.state.isKiller
     console.log("killer : "+killer)

    if (mapName == "spaceship.tmj") {
        if(isPoped == false){
        showRole();
        isPoped = true;}
        if(killer == true){
            killingPossibility = true
        }
        
    }
    console.log("killing" + killingPossibility)

    await WA.players.configureTracking();
    const players = WA.players.list();
    for (const otherPlayer of players) {
        const position1 = await WA.player.getPosition();
        const position2 = otherPlayer.position;

        if (Math.sqrt((position1.x - position2.x) ** 2 + (position1.y - position2.y) ** 2) < 60 && otherPlayer.state.dead != true && killingPossibility == true) {
            WA.ui.actionBar.addButton({
                id: 'kill-btn',
                label: `Tuer ${otherPlayer.name}`,
                callback: (event) => {
                    console.log('Button clicked', event);
                    WA.event.broadcast('player-killed', {killedPlayerId: otherPlayer.playerId});
                    screamSound.play(undefined);

                }
            });
        }
    }
}

async function removeKillButton() {
    await WA.players.configureTracking();
    const players = WA.players.list();
    for (const otherPlayer of players) {

        const position1 = await WA.player.getPosition();
        const position2 = otherPlayer.position;

        if (Math.sqrt((position1.x - position2.x) ** 2 + (position1.y - position2.y) ** 2) > 60) {
            WA.ui.actionBar.removeButton('kill-btn');

        }
    }
}

function checkPlayers() {
    const players = Array.from(WA.players.list());
    if (WA.player.state.isReady == false || players.length == 0) {
        return false;
    }
    for (const player of players) {
        if (player.state.isReady == false) {
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
            WA.event.broadcast("started", null)
        }
    }, 1000);
}


function listenOnPlayers() {
    WA.event.on("started").subscribe(() => {
        WA.nav.goToRoom('spaceship.tmj');


        
    });
}

function listenForCountDown() {
    WA.event.on("countdown").subscribe(() => {
        startCountDown();
    });
}

function listenOnGreenZone() {
    WA.room.area.onEnter('greenZone').subscribe(() => {
            WA.player.state.isReady = true;
            if (checkPlayers()) {
                console.log("lancement de la popup")
                closePopup();
                const buttonDescriptor = {
                    id: "startButton",
                    label: "Start",
                    callback: () => {
                        console.log('fermer')
                        closePopup();
                        WA.event.broadcast("countdown", null)
                    }
                };
                currentPopup = WA.ui.openPopup("countDown", "Lancer la partie ?", [buttonDescriptor])
            }
        }
    )
    WA.room.area.onLeave('greenZone').subscribe(() => {
        WA.player.state.isReady = false;
        console.log('is ready player ' + WA.player.state.isReady)
        console.log(checkPlayers())
        if (checkPlayers()) {
            console.log("Tout les jouers sont prets")
        } else {
            closePopup();
            clearInterval(interval);
        }
    });


}

function extractLastSegmentFromUrl(url: string) {
    // Utilisation de la méthode split() pour séparer l'URL en segments en fonction du caractère "/"
    const segments = url.split('/');
    // Retourner le dernier segment de l'URL
    return segments.pop();
}

async function showRole(){
    if(await WA.player.state.isKiller == true){
        WA.ui.openPopup("rolePopup", "Vous êtes un imposteur", [])
    }else{
        WA.ui.openPopup("rolePopup", "Vous êtes un Crewmate", [])
    }

    setInterval(function() {
    }, 4000);
    closePopup()
    
}

function isKiller(){
    let a = Math.random()*10;
    console.log(Math.trunc(a/2))
    if (Math.trunc(a%2)==0) return true
    else return false;
}

export {};