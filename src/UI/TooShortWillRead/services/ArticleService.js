import Article from "../models/Article";
import ArticlesAsyncStorage from "./ArticlesAsyncStorage";
const TSWR_BASE_URL = 'https://tooshortwillreadwebapi20220129184421.azurewebsites.net';

const LOAD_ARTICLES_ATTEMPS_TRESHOLD = 10;
const RUN_READ_ARTICLES_CLEANUP_TRESHOLD = 1;
const ArticleService = {
    getRandomArticleIdAsync: async function() {
        const randomArticleIdResponse = await fetch(`${TSWR_BASE_URL}/api/article/random/id`);
        const articleIdJson = await randomArticleIdResponse.json();
        return articleIdJson.id;
    },
    getArticleById: async function (articleId) {
        const randomArticleResponse = await fetch(`${TSWR_BASE_URL}/api/article/${articleId}`);
        const articleDataJson = await randomArticleResponse.json();
        return new Article(articleDataJson.id, articleDataJson.header, articleDataJson.text, articleDataJson.imageLink);
    },
    getArticlesCountAsync: async function() {
        const articlesCountResponse = await fetch(`${TSWR_BASE_URL}/api/article/count`);
        const articlesCountJson = await articlesCountResponse.json();
        const articlesCount = articlesCountJson.count;
        return articlesCount;
    },
    loadNewArticleAsync: async function() {
        let isUnique = false;
        let attempts = 0;
        let articleId;
        do
        {
            articleId = await this.getRandomArticleIdAsync();
            if(!await ArticlesAsyncStorage.articleExists(articleId)){
                isUnique = true;
            }
            console.log('attemp number', attempts)
            attempts++;
        } while(!isUnique && attempts <= LOAD_ARTICLES_ATTEMPS_TRESHOLD);

        if(attempts >= RUN_READ_ARTICLES_CLEANUP_TRESHOLD)
        {
            const articlesCount = await this.getArticlesCountAsync();
            await ArticlesAsyncStorage.cleanArticles(articlesCount);
        }
        
        await ArticlesAsyncStorage.addArticle(articleId);
        return this.getArticleById(articleId);
    }
}

export default ArticleService;