export class Release {

    chapter: String
    url: String
    read: Boolean
    date: Date

    constructor(chapter: String, url: String, read: Boolean, date: String) {
        this.chapter = chapter
        this.url = url
        this.read = read
        this.date = new Date()
    }
}
