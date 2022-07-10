import ArticleService from "../../services/ArticleService";
import { loadArticleStart, saveArticleAsRead, loadArticleSuccess } from "./readArticlesActions";
import Config from "react-native-config";

const LOAD_ARTICLES_ATTEMPS_TRESHOLD = Config.LOAD_ARTICLES_ATTEMPS_TRESHOLD;
const RUN_READ_ARTICLES_CLEANUP_TRESHOLD = Config.RUN_READ_ARTICLES_CLEANUP_TRESHOLD;

export const loadArticle = () => async (dispatch, getState) => {
    console.log(getState());
    const { readArticles } = getState().readArticlesReducer;
    console.log('articles read', readArticles)
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

    if (attempts >= RUN_READ_ARTICLES_CLEANUP_TRESHOLD) {
        const articlesCount =  await ArticleService.getArticlesCountAsync();
       // await ArticlesAsyncStorage.cleanArticles(articlesCount);
    }

    dispatch(saveArticleAsRead(articleId));
    const article = await ArticleService.getArticleById(articleId);
    dispatch(loadArticleSuccess(article));
    //console.log('current article',getState().readArticlesReducer.currentArticle)
} 