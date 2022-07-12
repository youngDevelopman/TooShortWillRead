import ArticleService from "../../services/ArticleService";
import { loadFavouriteArticleFailure, loadFavouriteArticleStart, loadFavouriteArticleSuccess } from "./favouritesArticlesActions"

export const loadFavouriteArticle = (id) => async (dispatch, getState) => {
    dispatch(loadFavouriteArticleStart());

    try {
        const article = await ArticleService.getArticleById(id);
        dispatch(loadFavouriteArticleSuccess(article));
    }
    catch (error) {
        dispatch(loadFavouriteArticleFailure(error));
    }
} 