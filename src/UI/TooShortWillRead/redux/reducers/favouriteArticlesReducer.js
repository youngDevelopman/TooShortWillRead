import { ADD_FAVOURITE_ARTICLE, LOAD_FAVOURITE_ARTICLE_FAILURE, LOAD_FAVOURITE_ARTICLE_START, LOAD_FAVOURITE_ARTICLE_SUCCESS, REMOVE_FAVOURITE_ARTICLE } from "../actions/favouritesArticlesActions";

const initialState = {
    currentFavouriteArticle: {
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
    favouriteArticles: []
};

function favouriteArticlesReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_FAVOURITE_ARTICLE:
            return { ...state, favouriteArticles: [action.payload, ...state.favouriteArticles] };
        case REMOVE_FAVOURITE_ARTICLE:
            return { ...state, favouriteArticles: state.favouriteArticles.filter(a => a.id !== action.payload) };
        case LOAD_FAVOURITE_ARTICLE_START:
            console.log('LOAD_FAVOURITE_ARTICLE_START')
            return { ...state, currentFavouriteArticle: { ...state.currentFavouriteArticle, isLoading: true, error: '' } };
        case LOAD_FAVOURITE_ARTICLE_SUCCESS:
            return { ...state, currentFavouriteArticle: { article: action.payload, isLoading: false } };
        case LOAD_FAVOURITE_ARTICLE_FAILURE:
            return { ...state, currentFavouriteArticle: { article: action.payload, isLoading: false, error: action.payload } };
        default:
            return state;
    }
}

export default favouriteArticlesReducer;