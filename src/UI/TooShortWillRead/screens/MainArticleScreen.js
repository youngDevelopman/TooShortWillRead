import React, { useEffect, useRef, useState } from "react";
import { View, Animated, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { removeFavouriteArticle, addFavouriteArticle } from "../redux/actions/favouritesArticlesActions";
import ArticleScreen from "./ArticleScreen";
import AppButton from "../components/AppButton";
import { loadArticle } from "../redux/actions/loadArticle";
import { incrementArticlesShownBeforeAdCount } from "../redux/actions/readArticlesActions";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import { SafeAreaView } from "react-native-safe-area-context";

class ArticleSwipable extends Swipeable {
    closeIstantly = () => {
      const { dragX, rowTranslation } = this.state;
      dragX.setValue(0);
      rowTranslation.setValue(0);
      this.setState({ rowState: Math.sign(0) });
    }
  }

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
                    <Ionicons name={favouriteButtonIcon} color='dodgerblue' size={30} />
                </TouchableOpacity>

                <AppButton onPress={onNextArticleLoadPress} title='Next article' />
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

export default function MainArticleScreen({ route, navigation }) {
    const dispatch = useDispatch();
    const scrollRef = useRef();

    const swipeableRef = useRef(null);

    useEffect(() => { loadNextArticle() }, []);
    const currentArticle = useSelector(state => state.readArticlesReducer.currentArticle);
    const { isLoading, article } = currentArticle;

    // Loading animation
    const [zIndex, setzIndex] = useState(-20);
    const loadingFadeAnim = useRef(new Animated.Value(0)).current;
    const fadeIn = () => {
        Animated.timing(loadingFadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start(({ finished }) => {
            console.log('start fade in');
            swipeableRef.current.closeIstantly();
            if (finished) {
                console.log('finished fade in');
            }
        });
    };
    const fadeOut = () => {
        Animated.timing(loadingFadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true
        }).start(({ finished }) => {
            console.log('start fade out');
            if (finished) {
                console.log('finished fade out');
                //swipeableRef.current.close();
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

    const loadArticleSwipe = (direction) => {
        console.log('direction', direction)
        loadNextArticle();
    };

    renderRightActions = (progress, dragX) => {
        //console.log('progress', progress)
        //console.log('dragX', dragX)
        const trans = dragX.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 1],
        });
        return (
            <View style={{
                justifyContent: 'center',
                flex: 1
            }}>
                <Text style={{ textAlign: 'right' }}>
                    This is test1111
                </Text>
            </View>
        );
    };

    return (
        <View>
            <ArticleSwipable
                ref={swipeableRef}
                renderRightActions={this.renderRightActions}
                onSwipeableClose={() => console.log('close')}
                onSwipeableOpen={loadArticleSwipe}>
                <ArticleScreen
                    article={article}
                    navigation={navigation}
                    scrollRef={scrollRef}
                    header={<Header
                        onFavouritePress={toggleFavouriteButton}
                        onNextArticleLoadPress={loadNextArticle}
                        favouriteButtonIcon={favouriteButtonIcon} />} />

            </ArticleSwipable>
            <LoadingComponent opacity={loadingFadeAnim} zIndex={zIndex} isLoading={isLoading} />
        </View>
    )
}