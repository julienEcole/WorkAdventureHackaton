import { Taches } from "./taches";

export class Player {
    pseudo: string;
    listeTaches: string[];
    alive: boolean;
    votedBy : number

    constructor(pseudo: string) {
        this.pseudo = pseudo;
        this.listeTaches = [];
        this.genererTachesAleatoires();
        this.alive = true;
        this.votedBy = 0;
    }

    // Méthode pour générer aléatoirement trois tâches
    protected genererTachesAleatoires() {
        const tachesPossibles: string[] = Object.values(Taches);

        // Si le nombre de tâches possibles est inférieur ou égal à 3, prenez toutes les tâches possibles
        if (tachesPossibles.length <= 3) {
            this.listeTaches = tachesPossibles;
        } else {
            const tachesAleatoires: string[] = [];
            const indexesUtilises: number[] = [];

            while (tachesAleatoires.length < 3) {
                const tacheIndex = Math.floor(Math.random() * tachesPossibles.length);
                if (!indexesUtilises.includes(tacheIndex)) {
                    tachesAleatoires.push(tachesPossibles[tacheIndex]);
                    indexesUtilises.push(tacheIndex);
                }
            }

            this.listeTaches = tachesAleatoires;
        }
    }

    // Méthode pour ajouter une tâche à la liste
    ajouterTache(tache: string) : void{
        this.listeTaches.push(tache);
    }

    ajouterListeTache(taches: string[]) : void {
        this.listeTaches = taches
    }

    // Méthode pour supprimer une tâche de la liste
    supprimerTache(tache: string) : void{
        const index = this.listeTaches.indexOf(tache);
        if (index !== -1) {
            this.listeTaches.splice(index, 1);
        }
    }

    vote(joueurSuspicieux : Player) : void{
        //TODO
        joueurSuspicieux.votedBy += 1;

        //EXECUTE IF HAVE THE MAX NUMBER OF VOTE

        this.votedBy = 0;
    }

    die() : void{
        this.alive = false;

        this.listeTaches = []
    }
}