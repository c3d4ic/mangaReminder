import WebHook from "./webhook";
import Firebase from "./firebase";
import { Manga } from "./manga";
import Scrabber from "./scrabber";
require('dotenv').config();

export default class Deploy {

    readonly webSites: Array<String> = [
        'http://mangarockteam.com/manga/after-being-reborn-i-became-the-strongest-to-save-everyone/',
        'http://mangarockteam.com/manga/global-martial-arts/',
        'http://mangarockteam.com/manga/onepunch-man/',
        'http://mangarockteam.com/manga/mushoku-tensei-isekai-ittara-honki-dasu/',
        'http://mangarockteam.com/manga/tate-no-yuusha-no-nariagari/',
        'http://mangarockteam.com/manga/hajime-no-ippo/',
        'http://mangarockteam.com/manga/tensei-shitara-slime-datta-ken_2/',
        'http://mangarockteam.com/manga/solo-max-level-newbie/',
        'http://mangarockteam.com/manga/the-world-after-the-fall/',
        'http://mangarockteam.com/manga/the-tutorial-is-too-hard/',
        'http://mangarockteam.com/manga/the-player-that-cant-level-up/',
        'http://mangarockteam.com/manga/the-breaker-eternal-force/',
        'http://mangarockteam.com/manga/return-of-the-sss-class-ranker/',
        'http://mangarockteam.com/manga/return-of-the-frozen-player/',
        'http://mangarockteam.com/manga/my-status-as-an-assassin-obviously-exceeds-the-braves/',
        'http://mangarockteam.com/manga/blue-lock/',
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
                                this.webhook.send('Nouveau chapitre disponible ! ', scrabberManga.title + ' - ' + remoteChapter.chapter, remoteChapter.url)
                            }
                        });
                    } else {
                        // Nouveau manga ajouté dans la liste
                        data.push(scrabberManga);
                        this.webhook.send('Nouveau manga ajouté ! ', scrabberManga.title, '')
                    }
                })
                this.firebase.postData(data)
            })
        })
    }
}
