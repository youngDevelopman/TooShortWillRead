export const ADD_FAVOURITE_ARTICLE = 'ADD_FAVOURITE_ARTICLE';
export const REMOVE_FAVOURITE_ARTICLE = 'REMOVE_FAVOURITE_ARTICLE';
export const LOAD_FAVOURITE_ARTICLE_START = 'LOAD_FAVOURITE_ARTICLE_START';
export const LOAD_FAVOURITE_ARTICLE_SUCCESS = 'LOAD_FAVOURITE_ARTICLE_SUCCESS';
export const LOAD_FAVOURITE_ARTICLE_FAILURE = 'LOAD_FAVOURITE_ARTICLE_FAILURE';

export const addFavouriteArticle = article => ({
    type: ADD_FAVOURITE_ARTICLE,
    payload: article,
});

export const removeFavouriteArticle = articleId => ({
    type: REMOVE_FAVOURITE_ARTICLE,
    payload: articleId,
});

export const loadFavouriteArticleStart = () => ({
    type: LOAD_FAVOURITE_ARTICLE_START,
});

export const loadFavouriteArticleSuccess = article => ({
    type: LOAD_FAVOURITE_ARTICLE_SUCCESS,
    payload: article
});

export const loadFavouriteArticleFailure = error => ({
    type: LOAD_FAVOURITE_ARTICLE_FAILURE,
    payload: error
});