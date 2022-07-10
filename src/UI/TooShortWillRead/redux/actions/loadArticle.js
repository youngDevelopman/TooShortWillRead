import ArticleService from "../../services/ArticleService";
import { loadArticleStart, saveArticleAsRead, loadArticleSuccess } from "./readArticlesActions";
import Config from "react-native-config";

const LOAD_ARTICLES_ATTEMPS_TRESHOLD = Config.LOAD_ARTICLES_ATTEMPS_TRESHOLD;
const RUN_READ_ARTICLES_CLEANUP_TRESHOLD = Config.RUN_READ_ARTICLES_CLEANUP_TRESHOLD;

export const loadArticle = () => async (dispatch, getState) => {
    const readArticlesState = getState().readArticlesReducer;
    const { readArticles } = readArticlesState;
    dispatch(loadArticleStart());

    let isUnique = false;
    let attempts = 0;
    let articleId;
    do {
        articleId = await ArticleService.getRandomArticleIdAsync();
        if (!readArticles.includes(articleId)) {
            isUnique = true;
        }
        console.log('attemp number', attempts)
        attempts++;
    } while (!isUnique && attempts <= LOAD_ARTICLES_ATTEMPS_TRESHOLD);

    if (attempts >= 0) {
        const { articlesCount } =  readArticlesState;
        console.log('ARTICLES COUNT', articlesCount);
       // await ArticlesAsyncStorage.cleanArticles(articlesCount);
    }

    dispatch(saveArticleAsRead(articleId));
    const article = await ArticleService.getArticleById(articleId);
    dispatch(loadArticleSuccess(article));
} 