import { Release } from "./release"

export class Manga {
    title: String
    image: String
    release: Array<Release>
    url: String

    constructor(title: String, image: String, release: Array<Release>, url: String) {
        this.title = title
        this.image = image
        this.release = release
        this.url = url
    }
}
