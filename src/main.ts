/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import {Cron, parseCronExpression, TimerBasedCronScheduler as scheduler} from "cron-schedule";


console.log('Script started successfully');

let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)

    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
    })

    WA.room.area.onLeave('clock').subscribe(closePopup)

    console.log('Scripting API ready');

    // At 19:00, hide the laptops
    const cronStartNight : Cron = parseCronExpression('0 19 * * *');
    scheduler.setInterval(cronStartNight, () => {
        WA.room.hideLayer("above/laptops");
    });

    // At 7:00, show the laptops
    const cronStartDay : Cron = parseCronExpression('0 7 * * *');
    scheduler.setInterval(cronStartDay, () => {
        WA.room.showLayer("above/laptops");
    });

    // If the player enters the room between 19:00 and 7:00, hide the laptops
    const now : Date = new Date();
    const startNight : Date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 0, 0);
    const startDay : Date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0, 0);
    if (now > startNight || now < startDay) {
        WA.room.hideLayer("above/laptops");
    }

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

function closePopup() : void{
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

export {};
