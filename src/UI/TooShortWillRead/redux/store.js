import { createStore, combineReducers } from 'redux';
import favouriteArticlesReducer from './reducers/favouriteArticlesReducer';

const rootReducer = combineReducers({
    favouriteArticlesReducer
});

export const store = createStore(rootReducer);