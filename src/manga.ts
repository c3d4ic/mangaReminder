import { Release } from "./release"

export class Manga {
    title: String
    image: String
    release: Array<Release>

    constructor(title: String, image: String, release: Array<Release>) {
        this.title = title
        this.image = image
        this.release = release
    }
}
