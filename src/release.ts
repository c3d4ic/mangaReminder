export class Release {

    chapter: String
    url: String
    read: Boolean
    date: Date
    pages: String[]

    constructor(chapter: String, url: String, read: Boolean, date: String, pages: String[]) {
        this.chapter = chapter
        this.url = url
        this.read = read
        this.date = new Date()
        this.pages = pages
    }
}
