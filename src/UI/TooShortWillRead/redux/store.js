import { createStore, combineReducers, applyMiddleware } from 'redux';
import favouriteArticlesReducer from './reducers/favouriteArticlesReducer';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import thunk from 'redux-thunk'
import readArticlesReducer from './reducers/readArticlesReducer';

const rootPersistConfig = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['readArticlesReducer', 'favouriteArticlesReducer']
};

const favouriteArticlesPersistConfig = {
    key: 'favouriteArticlesReducer',
    storage: AsyncStorage,
    blacklist: ['currentFavouriteArticle']
};

const readArticlesPersistConfig = {
    key: 'readArticlesReducer',
    storage: AsyncStorage,
    blacklist: ['currentArticle', 'articlesCount']
};

const rootReducer = combineReducers({
    favouriteArticlesReducer: persistReducer(favouriteArticlesPersistConfig, favouriteArticlesReducer),
    readArticlesReducer: persistReducer(readArticlesPersistConfig, readArticlesReducer)
});

const persistedRootReducer = persistReducer(rootPersistConfig, rootReducer);
export const store = createStore(persistedRootReducer, applyMiddleware(thunk));
export const persistor = persistStore(store);