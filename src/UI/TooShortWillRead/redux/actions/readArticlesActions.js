export const LOAD_ARTICLE_START = 'LOAD_ARTICLE_START';
export const LOAD_ARTICLE_SUCCESS = 'LOAD_ARTICLE_SUCCESS';
export const LOAD_ARTICLE_FAILURE = 'LOAD_ARTICLE_FAILURE';
export const SAVE_ARTICLE_AS_READ = 'SAVE_ARTICLE_AS_READ';
export const SAVE_ARTICLES_COUNT = 'SAVE_ARTICLES_COUNT';
export const CLEAN_MOST_OUTDATED_ARTICLES = 'CLEAN_MOST_OUTDATED_ARTICLES';
export const INCREMENT_ARTICLES_SHOWN_BEFORE_AD_COUNT = 'INCREMENT_ARTICLES_SHOWN_BEFORE_AD_COUNT';

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

export const saveArticlesCount = articlesCount => ({
    type: SAVE_ARTICLES_COUNT,
    payload: articlesCount
});

// Clean the most outdated articles that come first in the array
export const cleanMostOutdatedArticles = articlesCount => ({
    type: CLEAN_MOST_OUTDATED_ARTICLES,
    payload: articlesCount
});

export const incrementArticlesShownBeforeAdCount = () => ({
    type: INCREMENT_ARTICLES_SHOWN_BEFORE_AD_COUNT,
});