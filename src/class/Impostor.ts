import { Player } from "./player";

export class Impostor extends Player{
    proie: Player[]

    constructor(pseudo: string, victimes : &Player[]) {
        super(pseudo)
        this.alive = true;
        this.listeTaches = []   //TO MODIFY si jamais on veut donner des false task au imposteurs
        this.proie = [];
        victimes.forEach(victime => {
            this.proie.push(victime)
        });
    }

    kill(victime : Player){ //TO FINISH
        if(victime instanceof Impostor)

        this.proie = this.proie.filter(proie => proie !== victime);

        victime.die()
    }
}