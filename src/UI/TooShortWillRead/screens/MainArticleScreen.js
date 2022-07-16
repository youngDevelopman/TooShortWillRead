import React, { useEffect, useRef, useState } from "react";
import { View, Animated, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { removeFavouriteArticle, addFavouriteArticle } from "../redux/actions/favouritesArticlesActions";
import ArticleScreen from "./ArticleScreen";
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
                <TouchableOpacity onPress={onFavouritePress} activeOpacity={0.7}>
                    <Ionicons name={favouriteButtonIcon} color='dodgerblue' size={30}/>
                </TouchableOpacity>
                
                <AppButton onPress={onNextArticleLoadPress} title='Next article' />
            </View>
        </View>
    )
}

const LoadingComponent = ({opacity, zIndex, isLoading}) => {
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
            <ActivityIndicator color="white" size="large" animating={isLoading}/>
        </Animated.View>
    )
}

export default function MainArticleScreen({ route, navigation }) {
    const dispatch = useDispatch();
    const scrollRef = useRef();

    useEffect(() => loadNextArticle(), []);
    const currentArticle = useSelector(state => state.readArticlesReducer.currentArticle);
    const { isLoading, article } = currentArticle;

    // Loading animation
    const [zIndex, setzIndex] = useState(-20);
    const loadingFadeAnim = useRef(new Animated.Value(0)).current;
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
        }).start(({finished}) => {
            if (finished) {
                setzIndex(-20);
            }
        })
      };

    useEffect(() => {
        if(isLoading) {
            fadeIn();
            setzIndex(100);
        }
        else {
            scrollToTheTop();
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

    const scrollToTheTop = () => {
        scrollRef.current?.scrollTo({
            y: 0,
            animated: false,
        });
    }

    const loadNextArticle = async () => {
        dispatch(loadArticle());
    
        dispatch(incrementArticlesShownBeforeAdCount())
    }

    return (
        <ArticleScreen
            article={article}
            loadingComponent={<LoadingComponent opacity={loadingFadeAnim} zIndex={zIndex} isLoading={isLoading}/>}
            navigation={navigation}
            scrollRef={scrollRef}
            header={<Header 
                        onFavouritePress={toggleFavouriteButton} 
                        onNextArticleLoadPress={loadNextArticle} 
                        favouriteButtonIcon={favouriteButtonIcon} />} />
    )
}