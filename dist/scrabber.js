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
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = require('cheerio');
const axios = require('axios');
class Scrabber {
    constructor(url) {
        this.url = url;
        this.manga = this.fetch(url);
    }
    fetch(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios.get(url);
                const $ = cheerio.load(response.data);
                const title = $(".post-title").text();
                const chapters = $(".wp-manga-chapter");
                const image = $(".summary_image");
                var imgURL = $(image).find("img").attr('data-src');
                var releases = [];
                releases = this.getReleases($, chapters);
                let manga = {
                    title: title,
                    image: imgURL,
                    release: releases
                };
                return manga;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getReleases($, chapters) {
        var releases = [];
        chapters.each((i, chapter) => {
            var span = $(chapter).find("span");
            var a = $(span).find("a");
            var chapterTitle = $(chapter).text();
            // console.log("chapterTitle : ", typeof $(a).attr())
            if (typeof $(a).attr() !== 'undefined') {
                console.log("ici");
                var url = $(a).attr('href');
                releases.push({
                    chapter: chapterTitle.trim(),
                    url: url,
                    read: false
                });
            }
        });
        // console.log("RELEASES : ", releases);
        return releases;
    }
}
exports.default = Scrabber;
