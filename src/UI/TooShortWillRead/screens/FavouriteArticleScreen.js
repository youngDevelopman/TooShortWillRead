import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { loadFavouriteArticle } from "../redux/actions/loadFavouriteArticle";
import Ionicons from "react-native-vector-icons/Ionicons";
import IconFA from 'react-native-vector-icons/FontAwesome';
import { removeFavouriteArticle, addFavouriteArticle } from "../redux/actions/favouritesArticlesActions";
import ArticleScreenRenew from "./ArticleScreenRenew";

const Header = ({ onFavouritePress, onClosePress, favouriteButtonIcon }) => {
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
                <TouchableOpacity onPress={onClosePress} activeOpacity={0.7}>
                    <View style={{
                        position: 'relative',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 40,
                        height: 40,
                    }}>
                        <IconFA name='circle' size={40} color="#383837" />
                        <Ionicons name='close' size={30} color='white' style={{ position: 'absolute', zIndex: 99 }} />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default function FavouriteArticleScreen({ route, navigation }) {
    const dispatch = useDispatch();
    const { articleId } = route.params;

    useEffect(() => dispatch(loadFavouriteArticle(articleId)), []);
    const currentArticle = useSelector(state => state.favouriteArticlesReducer.currentFavouriteArticle);
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

    const closeArticleScreen = () => {
        navigation.goBack();
    }

    return (
        <ArticleScreenRenew
            article={article}
            isLoading={isLoading}
            header={<Header 
                        onFavouritePress={toggleFavouriteButton} 
                        onClosePress={closeArticleScreen} 
                        favouriteButtonIcon={favouriteButtonIcon} />} />
    )
}