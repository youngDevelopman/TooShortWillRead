import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Animated, ActivityIndicator, SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { loadFavouriteArticle } from "../redux/actions/loadFavouriteArticle";
import Ionicons from "react-native-vector-icons/Ionicons";
import IconFA from 'react-native-vector-icons/FontAwesome';
import { removeFavouriteArticle, addFavouriteArticle } from "../redux/actions/favouritesArticlesActions";
import ArticleScreen from "./ArticleScreen";

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
                <TouchableOpacity onPress={onFavouritePress} activeOpacity={0.7}>
                    <Ionicons name={favouriteButtonIcon} color='dodgerblue' size={30} />
                </TouchableOpacity>
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

const LoadingComponent = ({ opacity, zIndex, isLoading }) => {
    return (
        <Animated.View style={{
            backgroundColor: 'black',
            position: 'absolute',
            top: 0, left: 0,
            right: 0, bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: opacity,
            zIndex: zIndex
        }}>
            <ActivityIndicator color="white" size="large" animating={isLoading} />
        </Animated.View>
    )
}

export default function FavouriteArticleScreen({ route, navigation }) {
    const dispatch = useDispatch();
    const { articleId } = route.params;

    useEffect(() => { dispatch(loadFavouriteArticle(articleId)) }, []);
    const currentArticle = useSelector(state => state.favouriteArticlesReducer.currentFavouriteArticle);
    const { isLoading, article } = currentArticle;

    // Loading animation
    const [zIndex, setzIndex] = useState(-20);
    const loadingFadeAnim = useRef(new Animated.Value(1)).current;
    const fadeIn = () => {
        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(loadingFadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start();
    };
    const fadeOut = () => {
        // Will change fadeAnim value to 0 in 3 seconds
        Animated.timing(loadingFadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true
        }).start(({ finished }) => {
            if (finished) {
                setzIndex(-20);
            }
        })
    };

    useEffect(() => {
        if (isLoading) {
            fadeIn();
            setzIndex(100);
        }
        else {
            fadeOut();
            setzIndex(100);
        }
    }, [isLoading]);

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
        <SafeAreaView style={{flex: 1, backgroundColor: 'black'}} edges={['right', 'left', 'top']}>
            <ArticleScreen
                article={article}               
                navigation={navigation}
                header={<Header
                    onFavouritePress={toggleFavouriteButton}
                    onClosePress={closeArticleScreen}
                    favouriteButtonIcon={favouriteButtonIcon} />} />
            <LoadingComponent opacity={loadingFadeAnim} zIndex={zIndex} isLoading={isLoading} />
        </SafeAreaView>
    )
}