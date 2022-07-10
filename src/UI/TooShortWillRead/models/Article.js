class Article {
    constructor(id, header, text, imageUrl, originalUrl, categories) {
        this.id = id;
        this.header = header;
        this.text = text;
        this.imageUrl = imageUrl;
        this.originalUrl = originalUrl;
        this.categories = categories;
    }
}

export default Article;