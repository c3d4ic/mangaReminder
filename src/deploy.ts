import WebHook from "./webhook";
import Firebase from "./firebase";
import { Manga } from "./manga";
import Scrabber from "./scrabber";
import { OptionScrabber } from "./model";
import { lastValueFrom } from "rxjs";
require('dotenv').config();

export default class Deploy {

    readonly webSites: Array<String> = [
        "https://demonicscans.org/manga/Omniscient-Reader%2527s-Viewpoint",
        "https://demonicscans.org/manga/-The-Player-That-Can%2527t-Level-Up",
        "https://demonicscans.org/manga/Blue-Lock",
        "https://demonicscans.org/manga/Hajime-no-Ippo",
        "https://demonicscans.org/manga/The-Tutorial-is-Too-Hard",
        "https://demonicscans.org/manga/Global-Martial-Arts",
        "https://demonicscans.org/manga/The-Regressed-Son-of-a-Duke-is-an-Assassin",
        "https://demonicscans.org/manga/The-Hero-Returns",
        "https://demonicscans.org/manga/I-Became-The-King-by-Scavenging",
        "https://demonicscans.org/manga/Return-of-the-SSS%25252DClass-Ranker",
        "https://demonicscans.org/manga/Solo-Max%25252DLevel-Newbie",
        "https://demonicscans.org/manga/The-World-After-the-Fall",
        "https://demonicscans.org/manga/After-Being-Reborn%252C-I-Became-the-Strongest-to-Save-Everyone",
        "https://demonicscans.org/manga/Mushoku-Tensei-%257EIsekai-Ittara-Honki-Dasu%257E",
        "https://demonicscans.org/manga/Tensei-Shitara-Slime-Datta-Ken",
        "https://demonicscans.org/manga/Eternal-Force--%2528The-Breaker-3%2529",
        "https://demonicscans.org/manga/Return-of-the-Frozen-Player",
        "https://demonicscans.org/manga/Assassin-de-Aru-Ore-no-Sutetasu-ga-Yuusha-Yori-mo-Akiraka-ni-Tsuyoi-Nodaga",
        "https://demonicscans.org/manga/One-Piece",
        "https://demonicscans.org/manga/The-Return-of-the-Disaster%25252DClass-Hero",
        "https://demonicscans.org/manga/Skeleton-Soldier",
        "https://demonicscans.org/manga/Boku-no-Hero-Academia",
        "https://demonicscans.org/manga/Jujutsu-Kaisen",
        "https://demonicscans.org/manga/Survival-Story-of-a-Sword-King-in-a-Fantasy-World",
        "https://demonicscans.org/manga/One%25252DPunch-Man",
        "https://demonicscans.org/manga/Reincarnator-%2528Manhwa%2529",
        "https://demonicscans.org/manga/All-Football-Talents-Are-Mine",
        "https://demonicscans.org/manga/Reaper-of-the-Drifting-Moon",
        "https://demonicscans.org/manga/Star%25252DEmbracing-Swordmaster",
        "https://demonicscans.org/manga/The-Indomitable-Martial-King",
        "https://demonicscans.org/manga/Tomb-Raider-King",
        "https://demonicscans.org/manga/Son%2527s-Retribution",
        "https://demonicscans.org/manga/Solo-Leveling%253A-Ragnarok",
        "https://demonicscans.org/manga/The-Beginning-After-the-End",
        "https://demonicscans.org/manga/Return-to-Player",
        "https://demonicscans.org/manga/Absolute-Regression",
        "https://demonicscans.org/manga/Absolute-Regression",
        "https://demonicscans.org/manga/Eternally-Regressing-Knight",
        "https://demonicscans.org/manga/Talent%25252DSwallowing-Magician",
        "https://demonicscans.org/manga/Reincarnation-Of-The-Heavenly-Demon"
    ]
    public firebase: any
    public webhook: any
    public promises: Array<Promise<Manga>> = []

    constructor() {
        this.firebase = new Firebase()
        this.webhook = new WebHook()
    }


    async run() {

        const firebaseData: Array<Manga> = await this.firebase.getData();
        const scrabber = new Scrabber()

        this.webSites.forEach(async url => {
            // console.log("url : ", url);
            // Je vérifie si il existe déja en BDD
            const mangaFound = firebaseData.find((manga) => { return manga.url === url })
            try {
                if (mangaFound) {
                    // console.log("FETCH ONLY NEW RELEASE")
                    this.promises.push(scrabber.fetchManga(url, OptionScrabber.onlyNewRelease))

                } else {
                    this.promises.push(scrabber.fetchManga(url, OptionScrabber.all))
                }

            } catch (e) {
                console.error(e)
            };
        });




        Promise.all(this.promises).then((mangas) => {
            this.firebase.getData().then((data: Array<Manga>) => {
                // console.log("data:  ", data);
                mangas.forEach((scrabberManga: Manga) => {
                    let mangaID = data.findIndex(remoteManga => remoteManga.title === scrabberManga.title);
                    if (mangaID > -1) {
                        scrabberManga.release.forEach(remoteChapter => {
                            if (data[mangaID].release) {
                                let chapterFind = data[mangaID].release.find(localChapter => localChapter?.chapter === remoteChapter?.chapter);
                                if (!chapterFind) {
                                    // Nouveau chapitre disponible
                                    data[mangaID].release.push(remoteChapter)
                                    console.log("Nouveau chapitre ! - ", scrabberManga.title)
                                    this.webhook.send('Nouveau chapitre disponible ! ', scrabberManga.title + ' - ' + remoteChapter.chapter, remoteChapter.url)
                                }
                            } else {
                                console.log("PAS DE RELEASE DONC NOUVEAU CHAPITRE");
                                data[mangaID].release = []
                                data[mangaID].release.push(remoteChapter)
                                console.log("Nouveau chapitre ! - ", scrabberManga.title)
                                this.webhook.send('Nouveau chapitre disponible d\'un nouveau manga ! ', scrabberManga.title + ' - ' + remoteChapter.chapter, remoteChapter.url)
                            }

                        });
                    } else {
                        // Nouveau manga ajouté dans la liste
                        data.push(scrabberManga)
                        // console.log("Nouveau Manga ! : ", scrabberManga);
                        this.webhook.send('Nouveau manga ajouté ! ', scrabberManga.title, '')
                    }
                })
                // console.log("data : ", data)
                this.firebase.postData(data)
            })
        })
    }
}
