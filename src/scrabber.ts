import { Manga } from "./manga";
import { OptionScrabber } from "./model";
import { Release } from "./release";

const cheerio = require('cheerio');
const axios = require('axios');


export default class Scrabber {


    constructor() {
    }

    // async init(url: String): Promise<Manga> {
    //     const manga: Promise<Manga> = await this.fetchManga(url);
    //     return manga
    // }

    async fetchManga(url: String, option: OptionScrabber): Promise<Manga> {

        // try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const title = $(".big-fat-titles").text().trim();

        const image = $("#manga-page");
        var imgURL = $(image).find("img").attr('src');

        var releases: Array<Release> = []

        $('#chapters-list li').each((index: number, element: any) => {

            const chapterTitle = $(element).find('a.chplinks').contents().filter((i: any, node: any) => node.type === 'text')
            .text().trim();
           
            const date = $(element).find('span').text().trim();
            const url = "https://demonicscans.org" + $(element).find('a').attr('href') || '';
            releases.push({ 
                chapter: chapterTitle,
                url: url,
                read: false,
                date: date,
                pages: []
            });
        });

        let manga: Manga = {
            title: title,
            image: imgURL,
            release: releases.reverse(),
            url: url
        }
        return manga
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


}
