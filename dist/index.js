"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = __importDefault(require("./firebase"));
const scrabber_1 = __importDefault(require("./scrabber"));
const server_1 = __importDefault(require("./server"));
const server = new server_1.default(4000);
const webSites = [
    'https://mangarockteam.com/manga/return-of-the-frozen-player/',
    'https://mangarockteam.com/manga/global-martial-arts/'
];
let mangas;
const promises = [];
const firebase = new firebase_1.default();
webSites.forEach((url) => __awaiter(void 0, void 0, void 0, function* () {
    const scrabber = new scrabber_1.default(url);
    promises.push(scrabber.manga);
    // await scrabber.manga.then(manga => {
    //     mangas.push(manga)
    //     // console.log('Manga : ', manga)
    // })
    // console.log('Mangas : ', mangas)
}));
Promise.all(promises).then((mangas) => {
    firebase.getData().then((data) => {
        mangas.forEach((scrabberManga) => {
            let mangaID = data.findIndex(remoteManga => remoteManga.title === scrabberManga.title);
            if (mangaID > -1) {
                scrabberManga.release.forEach(remoteChapter => {
                    let chapterFind = data[mangaID].release.find(localChapter => localChapter.chapter === remoteChapter.chapter);
                    if (!chapterFind) {
                        // Nouveau chapitre disponible
                        data[mangaID].release.push(remoteChapter);
                        console.log("NEW CHAPTER : ", scrabberManga.title);
                        // newChapterEvent.emit('new', 'chapter', scrabberManga.title);
                    }
                });
            }
            else {
                // Le manga n'existe pas - je l'ajoute
                data.push(scrabberManga);
                console.log("NEW MANGA");
                // newChapterEvent.emit('new', 'manga', scrabberManga.title);
            }
        });
        firebase.postData(data);
    });
    // METTRE A JOURS LA BDD
    // SI NOUVEAUTE --> NOTIFIER WEBHOOK DISCORD
});
// scrabber.init().then(() => {
//     console.log("Mangas : ", scrabber.mangas);
// })
server.start();
