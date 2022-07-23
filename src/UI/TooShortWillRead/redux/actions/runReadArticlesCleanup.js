import Config from "react-native-config";
import { cleanMostOutdatedArticles } from "./readArticlesActions";

const RUN_READ_ARTICLES_CLEANUP_TRESHOLD = Config.RUN_READ_ARTICLES_CLEANUP_TRESHOLD;
const CLENUP_ARTICLES_PERCENTAGE_TRESHOLD = Config.CLENUP_ARTICLES_PERCENTAGE_TRESHOLD;
const ARTICLES_PERCENTAGE_TO_CLEAN = Config.ARTICLES_PERCENTAGE_TO_CLEAN;
export const runReadArticlesCleanup = (attemps) => async (dispatch, getState) => {
    if (attemps => RUN_READ_ARTICLES_CLEANUP_TRESHOLD) {
        const { articlesCount, readArticles } = getState().readArticlesReducer;
        const articlesRead = readArticles.length;
        const loadedArticlesPercentage = (100 * articlesRead) / articlesCount;
        if (loadedArticlesPercentage >= CLENUP_ARTICLES_PERCENTAGE_TRESHOLD) {
            console.log('Run articles cleanup...');
            const numberOfArticlesToClean = Math.round((ARTICLES_PERCENTAGE_TO_CLEAN * articlesRead) / 100);
            dispatch(cleanMostOutdatedArticles(numberOfArticlesToClean));
        }
    }
}