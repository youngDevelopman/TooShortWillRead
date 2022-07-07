import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVOURITES_ARTICLES_CACHE_PREFIX = '@FavouriteArticles:';
const FavouriteArticlesAsyncStorage = {
    getAllArticles: async function () {
        let keys = await AsyncStorage.getAllKeys();
        keys = keys.filter(key => key.startsWith(FAVOURITES_ARTICLES_CACHE_PREFIX));
        const articles = await AsyncStorage.multiGet(keys);
        return articles;
    },
    addArticle: async function(id,title,imageUrl,categories){
        const value = {
            title: title,
            imageUrl: imageUrl,
            categories: categories
        }
        await AsyncStorage.setItem(
            FAVOURITES_ARTICLES_CACHE_PREFIX.concat(id),
            JSON.stringify(value)
        );
    },
    articleExists: async function (id) {
        return await AsyncStorage.getItem(FAVOURITES_ARTICLES_CACHE_PREFIX.concat(id)) !== null
    },
    removeArticle: async function (id) {
        return await AsyncStorage.removeItem(id);
    },
}

export default FavouriteArticlesAsyncStorage;