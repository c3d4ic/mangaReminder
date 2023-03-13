import WebHook from "./webhook";
import Firebase from "./firebase";
import { Manga } from "./manga";
import Scrabber from "./scrabber";
require('dotenv').config();

export default class Deploy {

    readonly webSites: Array<String> = [
        'https://mangarockteam.com/manga/solo-max-level-newbie/',
        'https://mangarockteam.com/manga/after-being-reborn-i-became-the-strongest-to-save-everyone/',
        'https://mangarockteam.com/manga/global-martial-arts/',
        'https://mangarockteam.com/manga/onepunch-man/',
        'https://mangarockteam.com/manga/mushoku-tensei-isekai-ittara-honki-dasu/',
        'https://mangarockteam.com/manga/tate-no-yuusha-no-nariagari/',
        'https://mangarockteam.com/manga/hajime-no-ippo/',
        'https://mangarockteam.com/manga/tensei-shitara-slime-datta-ken_2/',
        'https://mangarockteam.com/manga/solo-max-level-newbie/',
        'https://mangarockteam.com/manga/the-world-after-the-fall/',
        'https://mangarockteam.com/manga/the-tutorial-is-too-hard/',
        'https://mangarockteam.com/manga/the-player-that-cant-level-up/',
        'https://mangarockteam.com/manga/the-breaker-eternal-force/',
        'https://mangarockteam.com/manga/return-of-the-sss-class-ranker/',
        'https://mangarockteam.com/manga/return-of-the-frozen-player/',
        'https://mangarockteam.com/manga/my-status-as-an-assassin-obviously-exceeds-the-braves/',
        'https://mangarockteam.com/manga/blue-lock/',
        'https://mangarockteam.com/manga/solo_leveling_6/',
        'https://mangarockteam.com/manga/kill-the-hero_2/'
    ]
    public firebase: any
    public webhook: any
    public promises: Array<Promise<Manga>> = []

    constructor() {
        this.firebase = new Firebase()
        this.webhook = new WebHook()
    }

    run() {
        this.webSites.forEach(async url => {
            const scrabber = new Scrabber(url)
            this.promises.push(scrabber.manga)
        });

        Promise.all(this.promises).then((mangas) => {
            this.firebase.getData().then((data: Array<Manga>) => {
                mangas.forEach((scrabberManga: Manga) => {
                    let mangaID = data.findIndex(remoteManga => remoteManga.title === scrabberManga.title);
                    if (mangaID > -1) {
                        scrabberManga.release.forEach(remoteChapter => {
                            let chapterFind = data[mangaID].release.find(localChapter => localChapter.chapter === remoteChapter.chapter);
                            if (!chapterFind) {
                                // Nouveau chapitre disponible
                                data[mangaID].release.push(remoteChapter);
                                console.log("Nouveau chapitre ! - ", scrabberManga.title);
                                this.webhook.send('Nouveau chapitre disponible ! ', scrabberManga.title + ' - ' + remoteChapter.chapter, remoteChapter.url)
                            }
                        });
                    } else {
                        // Nouveau manga ajouté dans la liste
                        data.push(scrabberManga);
                        console.log("Nouveau Manga !");
                        this.webhook.send('Nouveau manga ajouté ! ', scrabberManga.title, '')
                    }
                })
                this.firebase.postData(data)
            })
        })
    }
}
