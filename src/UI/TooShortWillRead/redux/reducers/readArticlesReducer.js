import { SAVE_ARTICLES_COUNT, LOAD_ARTICLE_FAILURE, LOAD_ARTICLE_START, LOAD_ARTICLE_SUCCESS, SAVE_ARTICLE_AS_READ } from "../actions/readArticlesActions";

const initialState = {
    articlesCount: 0,
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
            return { ...state, currentArticle: { article: action.payload, isLoading: false } };
        case LOAD_ARTICLE_FAILURE:
            return { ...state, currentArticle: { article: action.payload, isLoading: false, error: action.payload } };
        case SAVE_ARTICLE_AS_READ:
            return { ...state, readArticles: [...state.readArticles, action.payload] };
        case SAVE_ARTICLES_COUNT:
            return { ...state, articlesCount: action.payload };
        default:
            return state;
    }
}

export default readArticlesReducer;
