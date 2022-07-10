import { ADD_FAVOURITE_ARTICLE, REMOVE_FAVOURITE_ARTICLE } from "../actions/favouritesArticlesActions";

const initialState = {
    favouriteArticles: []
};

function favouriteArticlesReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_FAVOURITE_ARTICLE:
            return { ...state, favouriteArticles: [action.payload, ...state.favouriteArticles] };
        case REMOVE_FAVOURITE_ARTICLE:
            return { ...state, favouriteArticles: state.favouriteArticles.filter(a => a.id !== action.payload) };
        default:
            return state;
    }
}

export default favouriteArticlesReducer;