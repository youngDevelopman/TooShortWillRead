import { SAVE_ARTICLES_COUNT, LOAD_ARTICLE_FAILURE, LOAD_ARTICLE_START, LOAD_ARTICLE_SUCCESS, SAVE_ARTICLE_AS_READ, CLEAN_MOST_OUTDATED_ARTICLES, INCREMENT_ARTICLES_SHOWN_BEFORE_AD_COUNT } from "../actions/readArticlesActions";

const initialState = {
    articlesCount: 0,
    articlesShownBeforeAd: 0,
    currentArticle: {
        isLoading: false,
        error: '',
        article: {
            id: '',
            header: '',
            text: '',
            imageUrl: '',
            originalUrl: '',
            categories: []
        }
    },
    readArticles: []
}

function readArticlesReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_ARTICLE_START:
            return { ...state, currentArticle: { ...state.currentArticle, isLoading: true, error: '' } };
        case LOAD_ARTICLE_SUCCESS:
            return { ...state, currentArticle: { article: { ...action.payload, categories: action.payload.categories.sort((a, b) => a.length > b.length)}, isLoading: false } };
        case LOAD_ARTICLE_FAILURE:
            return { ...state, currentArticle: { article: action.payload, isLoading: false, error: action.payload } };
        case SAVE_ARTICLE_AS_READ:
            return { ...state, readArticles: [...state.readArticles, action.payload] };
        case SAVE_ARTICLES_COUNT:
            return { ...state, articlesCount: action.payload };
        case CLEAN_MOST_OUTDATED_ARTICLES:
            return { ...state, readArticles: state.readArticles.slice(action.payload) }
        case INCREMENT_ARTICLES_SHOWN_BEFORE_AD_COUNT:
            return { ...state, articlesShownBeforeAd: state.articlesShownBeforeAd + 1 }
        default:
            return state;
    }
}

export default readArticlesReducer;
