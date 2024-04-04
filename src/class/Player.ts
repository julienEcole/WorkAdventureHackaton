export class Player {
    pseudo: string;
    listeTaches: string[];
    alive: boolean;

    constructor(pseudo: string) {
        this.pseudo = pseudo;
        this.listeTaches = [];
        this.alive = true;
    }

    // Méthode pour ajouter une tâche à la liste
    ajouterTache(tache: string) {
        this.listeTaches.push(tache);
    }

    ajouterListeTache(taches: string[]) {
        this.listeTaches = taches
    }

    // Méthode pour supprimer une tâche de la liste
    supprimerTache(tache: string) {
        const index = this.listeTaches.indexOf(tache);
        if (index !== -1) {
            this.listeTaches.splice(index, 1);
        }
    }

    die(){
        this.alive = false;

        this.listeTaches = []
    }
}