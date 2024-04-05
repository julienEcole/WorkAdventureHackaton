import { Taches } from "./Taches";

export class Player {
    pseudo: string;
    taches: string[];
    alive: boolean;
    votedBy : number

    constructor(pseudo: string) {
        this.pseudo = pseudo;
        this.taches = [];
        this.genererTachesAleatoires();
        this.alive = true;
        this.votedBy = 0;
    }

    // Méthode pour générer aléatoirement trois tâches
    protected genererTachesAleatoires() {
        const tachesPossibles: string[] = Object.values(Taches);

        tachesPossibles.forEach(element => {
            console.log("tache Possible : %s\n", element)
        });

        // Si le nombre de tâches possibles est inférieur ou égal à 3, prenez toutes les tâches possibles
        if (tachesPossibles.length < 3) {
            this.taches = tachesPossibles;
        } else {
            const indexesUtilises: number[] = [];

            while (this.taches.length < 3) {
                const tacheIndex = Math.floor(Math.random() * tachesPossibles.length);

                console.log("index choisi : %d\n", tacheIndex)
                if (!indexesUtilises.includes(tacheIndex)) {
                    this.taches.push(tachesPossibles[tacheIndex]);
                    console.log("task add : " + tachesPossibles[tacheIndex] + '\n')
                    indexesUtilises.push(tacheIndex);
                }
            }
        }
    }

    // Méthode pour ajouter une tâche à la liste
    ajouterTache(tache: string) : void{
        this.taches.push(tache);
    }

    ajouterListeTache(taches: string[]) : void {
        this.taches = taches
    }

    // Méthode pour supprimer une tâche de la liste
    supprimerTache(tache: string) : void{
        const index = this.taches.indexOf(tache);
        if (index !== -1) {
            this.taches.splice(index, 1);
        }
    }

    vote(joueurSuspicieux : Player) : void{
        //TODO
        joueurSuspicieux.votedBy += 1;

        //EXECUTE IF HAVE THE MAX NUMBER OF VOTE

        this.votedBy = 0;
    }

    tacheToString() : string{
        var result : string = ""

        this.taches.forEach(tache => {
            result += tache + '\n'
        });
        return result
    }

    die() : void{
        this.alive = false;

        this.taches = []
    }
}

export class Impostor extends Player{
    proies: Player[]

    constructor(pseudo: string, victimes : &Player[]) {
        super(pseudo)
        this.taches = []   //TO MODIFY si jamais on veut donner des false task au imposteurs
        this.proies = [];
        victimes.forEach(victime => {
            this.proies.push(victime)
        });
    }

    supprimerTache(_tache: string) : void {  //need to be neutrelised
        _tache = "";
        return;
    }

    tacheToString() : string{
        var result : string = ""

        this.proies.forEach(proie => {
            result = "kill " + proie.pseudo + '\n'
        });
        return result
    }

    kill(victime : Player) : void{ //TO FINISH
        if(victime instanceof Impostor)

        this.proies = this.proies.filter(proie => proie !== victime);

        victime.die()
    }
}