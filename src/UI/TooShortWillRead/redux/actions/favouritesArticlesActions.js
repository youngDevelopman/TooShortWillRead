export const ADD_FAVOURITE_ARTICLE = 'ADD_FAVOURITE_ARTICLE';
export const REMOVE_FAVOURITE_ARTICLE = 'REMOVE_FAVOURITE_ARTICLE';

export const addFavouriteArticle = article => ({
    type: ADD_FAVOURITE_ARTICLE,
    payload: article,
});

export const removeFavouriteArticle = articleId => ({
    type: REMOVE_FAVOURITE_ARTICLE,
    payload: articleId,
});