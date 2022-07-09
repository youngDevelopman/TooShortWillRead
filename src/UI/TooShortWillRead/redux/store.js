import { createStore, combineReducers, applyMiddleware } from 'redux';
import favouriteArticlesReducer from './reducers/favouriteArticlesReducer';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import thunk from 'redux-thunk'

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
};

const rootReducer = combineReducers({
    favouriteArticlesReducer: persistReducer(persistConfig, favouriteArticlesReducer)
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
export const persistor = persistStore(store);