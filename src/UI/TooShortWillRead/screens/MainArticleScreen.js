import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { removeFavouriteArticle, addFavouriteArticle } from "../redux/actions/favouritesArticlesActions";
import ArticleScreenRenew from "./ArticleScreenRenew";
import AppButton from "../components/AppButton";
import { loadArticle } from "../redux/actions/loadArticle";
import { incrementArticlesShownBeforeAdCount } from "../redux/actions/readArticlesActions";

const Header = ({ onFavouritePress, onNextArticleLoadPress, favouriteButtonIcon }) => {
    return (
        <View>
            <View style={{
                flexDirection: 'row',
                textAlign: 'center',
                justifyContent: 'space-between',
                paddingVertical: 8,
                paddingHorizontal: 10,
                marginTop: 10,
                marginBottom: 10
            }}>
                <Ionicons name={favouriteButtonIcon} color='dodgerblue' size={30} onPress={onFavouritePress} />
                <AppButton onPress={onNextArticleLoadPress} title='Next article' />
            </View>
        </View>
    )
}

export default function MainArticleScreen({ route, navigation }) {
    const dispatch = useDispatch();
    const scrollRef = useRef();

    useEffect(() => loadNextArticle(), []);
    const currentArticle = useSelector(state => state.readArticlesReducer.currentArticle);
    const { isLoading, article } = currentArticle;

    // Favourite article config
    const getFavouriteIcon = () => {
        return isFavourite ? 'star' : 'star-outline';
    }
    const isFavourite = useSelector(state =>
        state.favouriteArticlesReducer.favouriteArticles.find(a => a.id === article.id) !== undefined);
    const [favouriteButtonIcon, setFavouriteButtonIcon] = useState(getFavouriteIcon());
    useEffect(() => {
        const favIcon = getFavouriteIcon();
        setFavouriteButtonIcon(favIcon);
    }, [isFavourite]);


    const toggleFavouriteButton = () => {
        if (isFavourite) {
            dispatch(removeFavouriteArticle(article.id));
        }
        else {
            const articleToAdd = {
                id: article.id,
                header: article.header,
                imageUrl: article.imageUrl,
                categories: article.categories
            };
            dispatch(addFavouriteArticle(articleToAdd));
        }
    }

    const scrollToTheTop = () => {
        scrollRef.current?.scrollTo({
            y: 0,
            animated: false,
        });
    }

    const loadNextArticle = async () => {
        dispatch(loadArticle());
        
        scrollToTheTop();
        dispatch(incrementArticlesShownBeforeAdCount())
    }

    return (
        <ArticleScreenRenew
            article={article}
            isLoading={isLoading}
            scrollRef={scrollRef}
            header={<Header 
                        onFavouritePress={toggleFavouriteButton} 
                        onNextArticleLoadPress={loadNextArticle} 
                        favouriteButtonIcon={favouriteButtonIcon} />} />
    )
}