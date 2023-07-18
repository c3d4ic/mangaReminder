import { Manga } from "./manga";
import { Release } from "./release";

const cheerio = require('cheerio');
const axios = require('axios');

export default class Scrabber {

    constructor() {
    }

    async init(url: String): Promise<Manga> {
        const manga: Promise<Manga> = await this.fetchManga(url);
        console.log("manga : ", manga);
        return manga
    }

    async fetchManga(url: String): Promise<any> {

        try {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            const title = $(".post-title").text();
            const chapters = $(".wp-manga-chapter");
            const image = $(".summary_image");
            var imgURL = $(image).find("img").attr('data-src');

            var releases: Array<Release> = []
            releases = await this.getReleases($, chapters);
            let pages
            for (let i = 0; i <= releases.length - 1; i++) {
                pages = await this.fetchScanPages(releases[i].url)
                releases[i].pages = pages

            }
            let manga: Manga = {
                title: title,
                image: imgURL,
                release: releases
            }

            return manga

        }
        catch (error) {
            console.error(error);
            return error
        }
    }

    async fetchScanPages(url: String): Promise<String[]> {
        try {
            const response = await axios.get(url);
            const $ = await cheerio.load(response.data);
            var pages: String[] = [];

            await $(".reading-content .page-break").each(async (index: number, element: any) => {
                var imgURL = await $(element).find("img").attr('data-src');
                imgURL = imgURL.replace(/(\r\n|\n|\r)/gm, "");
                pages.push(imgURL.trim());

            });
 
            return pages;
        }
        catch (error) {
            console.error(error);
            return []
        }
    }



    async getReleases($: any, chapters: any): Promise<Array<Release>> {

        var releases: Array<Release> = []
        await chapters.each(async (i: number, chapter: any) => {
            var span = $(chapter).find("span");
            var a = $(span).find("a");
            var chapterTitle = $(chapter).text();
            if (typeof $(a).attr() !== 'undefined') {
                var url = $(a).attr('href');

                releases.push({
                    chapter: chapterTitle.trim(),
                    url: url,
                    read: false,
                    date: new Date(),
                    pages: []
                });
            }
        })
        return releases
    }
}
