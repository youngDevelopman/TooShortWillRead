class Article {
    constructor(id, header, text, imageLink, originalLink, categories) {
        this.id = id;
        this.header = header;
        this.text = text;
        this.imageLink = imageLink;
        this.originalLink = originalLink;
        this.categories = categories;
    }
}

export default Article;