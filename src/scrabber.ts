import e from "express";
import { Manga } from "./manga";
import { Release } from "./release";

const cheerio = require('cheerio');
const axios = require('axios');

export default class Scrabber {

    readonly url: String
    public manga: Promise<Manga>

    constructor(
        url: String
    ) {
        this.url = url
        this.manga = this.fetch(url)
    }

    async fetch(url: String): Promise<any> {

        try {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            const title = $(".post-title").text();
            const chapters = $(".wp-manga-chapter");
            const image = $(".summary_image");
            var imgURL = $(image).find("img").attr('data-src');

            var releases: Array<Release> = []
            releases = this.getReleases($, chapters)

            let manga: Manga = {
                title: title,
                image: imgURL,
                release: releases
            }

            return manga
        }
        catch (error) {
            console.error(error);
        }
    }



    getReleases($: any, chapters: any): Array<Release> {

        var releases: Array<Release> = []
        chapters.each((i: number, chapter: any) => {
            var span = $(chapter).find("span");
            var a = $(span).find("a");
            var chapterTitle = $(chapter).text();
            if (typeof $(a).attr() !== 'undefined') {
                var url = $(a).attr('href');
                releases.push({
                    chapter: chapterTitle.trim(),
                    url: url,
                    read: false
                });
            }
        })
        return releases;
    }
}
