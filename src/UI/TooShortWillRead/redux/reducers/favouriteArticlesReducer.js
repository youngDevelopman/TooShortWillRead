import { GET_FAVOURITE_ARTICLES, ADD_FAVOURITE_ARTICLE, REMOVE_FAVOURITE_ARTICLE } from "../actions/favouritesArticlesActions";

const initialState = {
    favouriteArticles: [
        {
            id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
            title: "TEST ARTICLE FROM THE STORE",
            imageUrl: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
            categories: ['Health & Medicine', 'Politics, Law & Government']
        }
    ]
};

function favouriteArticlesReducer(state = initialState, action) {
    switch (action.type) {
        case GET_FAVOURITE_ARTICLES:
            return { ...state, favouriteArticles: action.payload };
        default:
            return state;
    }
}

export default favouriteArticlesReducer;