export class Release {

    chapter: String
    url: String
    read: Boolean

    constructor(chapter: String, url: String, read: Boolean) {
        this.chapter = chapter
        this.url = url
        this.read = read
    }
}
