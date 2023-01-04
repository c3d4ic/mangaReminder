import { Console } from "console";
import Firebase from "./firebase";
import { Manga } from "./manga";
import Scrabber from "./scrabber";
import Server from "./server";

const server = new Server(4000)


const webSites: Array<String> = [
    'https://mangarockteam.com/manga/return-of-the-frozen-player/',
    'https://mangarockteam.com/manga/global-martial-arts/'
]

const promises: Array<Promise<Manga>> = []
const firebase = new Firebase()

webSites.forEach(async url => {
    const scrabber = new Scrabber(url)
    promises.push(scrabber.manga)
});

Promise.all(promises).then((mangas) => {
    firebase.getData().then((data: Array<Manga>) => {
        mangas.forEach((scrabberManga: Manga) => {
            let mangaID = data.findIndex(remoteManga => remoteManga.title === scrabberManga.title);
            if (mangaID > -1) {
                scrabberManga.release.forEach(remoteChapter => {
                    let chapterFind = data[mangaID].release.find(localChapter => localChapter.chapter === remoteChapter.chapter);
                    if (!chapterFind) {
                        // Nouveau chapitre disponible
                        data[mangaID].release.push(remoteChapter);
                        console.log("NEW CHAPTER : ", scrabberManga.title)
                        // newChapterEvent.emit('new', 'chapter', scrabberManga.title);
                    }
                });
            } else {
                data.push(scrabberManga);
                console.log("NEW MANGA")
                // newChapterEvent.emit('new', 'manga', scrabberManga.title);

            }
        })
        firebase.postData(data)
    })

    // SI NOUVEAUTE --> NOTIFIER WEBHOOK DISCORD

})



// scrabber.init().then(() => {
//     console.log("Mangas : ", scrabber.mangas);

// })

server.start()
