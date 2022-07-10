import ArticleService from "../../services/ArticleService";
import { saveArticlesCount } from "./readArticlesActions";

export const loadArticlesCount = () => async (dispatch, getState) => {
    const articlesCount =  await ArticleService.getArticlesCountAsync();
    dispatch(saveArticlesCount(articlesCount));
} 