import { Manga } from "./manga";

export interface Subject {
    registerObserver(o: Observer): any;
    removeObserver(o: Observer): any;
    notifyObservers(): any;
}

export interface Observer {
    update(manga: Manga): any;
}