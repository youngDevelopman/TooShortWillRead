import ArticleService from "../../services/ArticleService";
import { loadArticleStart, saveArticleAsRead, loadArticleSuccess } from "./readArticlesActions";
import Config from "react-native-config";
import { runReadArticlesCleanup } from "./runReadArticlesCleanup";

const LOAD_ARTICLES_ATTEMPS_TRESHOLD = Config.LOAD_ARTICLES_ATTEMPS_TRESHOLD;

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


    const article = await ArticleService.getArticleById(articleId);
    dispatch(loadArticleSuccess(article));

    dispatch(saveArticleAsRead(articleId));
    dispatch(runReadArticlesCleanup(attempts));
} 