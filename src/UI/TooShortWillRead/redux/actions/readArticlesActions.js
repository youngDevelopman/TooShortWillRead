export const LOAD_ARTICLE_START = 'LOAD_ARTICLE_START';
export const LOAD_ARTICLE_SUCCESS = 'LOAD_ARTICLE_SUCCESS';
export const LOAD_ARTICLE_FAILURE = 'LOAD_ARTICLE_FAILURE';
export const SAVE_ARTICLE_AS_READ = 'SAVE_ARTICLE_AS_READ';

export const loadArticleStart = () => ({
    type: LOAD_ARTICLE_START,
});

export const loadArticleSuccess = article => ({
    type: LOAD_ARTICLE_SUCCESS,
    payload: article
});

export const loadArticleFailure = error => ({
    type: LOAD_ARTICLE_FAILURE,
    payload: error
});

export const saveArticleAsRead = articleId => ({
    type: SAVE_ARTICLE_AS_READ,
    payload: articleId
});