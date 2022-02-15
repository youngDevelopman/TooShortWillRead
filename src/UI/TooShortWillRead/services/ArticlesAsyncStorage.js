import AsyncStorage from '@react-native-async-storage/async-storage';

const READ_ARTICLES_CACHE_PREFIX = '@ReadArticles:';
const CLENUP_ARTICLES_PERCENTAGE_TRESHOLD = 60;
const ARTICLES_PERCENTAGE_TO_CLEAN = 20;

const ArticlesAsyncStorage = {
    articleExists: async function(articleId) {
        return await AsyncStorage.getItem(READ_ARTICLES_CACHE_PREFIX.concat(articleId)) !== null
    },
    clean: async function() {
        try {
            const keys = await AsyncStorage.getAllKeys();
            await AsyncStorage.multiRemove(keys);
        } catch (error) {
            console.error('Error clearing app data.');
        }
    },
    addArticle: async function(articleId) {
        try {
            const time = new Date().toLocaleString();
            console.log(time)
            await AsyncStorage.setItem(
                READ_ARTICLES_CACHE_PREFIX.concat(articleId),
                time
            );
            console.log('saved');
          } catch (error) {
            // Error saving data
            console.log('error', error)
          }
    },
    cleanArticles: async function(articlesCount) {
        const keys = await AsyncStorage.getAllKeys();
        const totalArticles = keys.length;
        console.log('articles count', articlesCount)
        console.log('total articles', totalArticles)
        const loadedArticlesPercentage = (100 * totalArticles) / articlesCount;
        console.log('loadedArticlesPercentage', loadedArticlesPercentage);

        if(loadedArticlesPercentage >= CLENUP_ARTICLES_PERCENTAGE_TRESHOLD)
        {
        const result = await AsyncStorage.multiGet(keys);
        result.sort((first, second) => {
            return new Date(first[1]) - new Date(second[1]);
        })
        const numberOfArticlesToClean = Math.round((ARTICLES_PERCENTAGE_TO_CLEAN * totalArticles) / 100);
        console.log(numberOfArticlesToClean);
        const articlesToClean = result.slice(0, numberOfArticlesToClean).map(a => a[0]);
        await AsyncStorage.multiRemove(articlesToClean);
        }
    },
}

export default ArticlesAsyncStorage;