import Article from "../models/Article";
import Config from "react-native-config";

const TSWR_BASE_URL = Config.TSWR_BASE_URL;
const ArticleService = {
    getRandomArticleIdAsync: async function () {
        const randomArticleIdResponse = await fetch(`${TSWR_BASE_URL}/api/article/random/id`);
        const articleIdJson = await randomArticleIdResponse.json();
        return articleIdJson.id;
    },
    getArticleById: async function (articleId) {
        const randomArticleResponse = await fetch(`${TSWR_BASE_URL}/api/article/${articleId}`);
        const articleDataJson = await randomArticleResponse.json();
        return new Article(
            articleDataJson.id, 
            articleDataJson.header, 
            articleDataJson.text, 
            articleDataJson.imageLink, 
            articleDataJson.originalUrl,
            articleDataJson.categories
        );
    },
    getArticlesCountAsync: async function () {
        const articlesCountResponse = await fetch(`${TSWR_BASE_URL}/api/article/count`);
        const articlesCountJson = await articlesCountResponse.json();
        const articlesCount = articlesCountJson.count;
        return articlesCount;
    }
}

export default ArticleService;