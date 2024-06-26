import React, { useEffect, useRef, useState } from "react";
import { View, Animated, ActivityIndicator, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { removeFavouriteArticle, addFavouriteArticle } from "../redux/actions/favouritesArticlesActions";
import ArticleScreen from "./ArticleScreen";
import { loadArticle } from "../redux/actions/loadArticle";
import { incrementArticlesShownBeforeAdCount } from "../redux/actions/readArticlesActions";
import Swipeable from 'react-native-gesture-handler/Swipeable';



const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

class ArticleSwipable extends Swipeable {
    closeIstantly = () => {
        const { dragX, rowTranslation } = this.state;
        dragX.setValue(0);
        rowTranslation.setValue(0);
        this.setState({ rowState: Math.sign(0) });
    }
    getDragX = () => {
        return this.state.dragX;
    }

    getRowTransition = () => {
        return this.state.rowTranslation;
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
    const nextArticleIconScale = useRef(new Animated.Value(0)).current;
    const nextArticleInconScaleInterpolated = nextArticleIconScale.interpolate({
        inputRange: [0, 135],
        outputRange: [0, 2.5],
        extrapolate: 'clamp'
    });

    const nextArticleFadeOutAnim = () => {
        Animated.timing(nextArticleIconScale, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true
        }).start()
    };

    useEffect(() => {
        //nextArticleIconScale.addListener(value => console.log('nextArticleIconScale', value))
        swipeableRef.current.getDragX().addListener(dragX => {
            //console.log('DRAG X EVENT', dragX);
            nextArticleIconScale.setValue(Math.abs(dragX.value));
        })
        swipeableRef.current.getRowTransition().addListener(x => {
            //console.log('Row transition', x);
            nextArticleIconScale.setValue(Math.abs(x.value));
        })
    }, [swipeableRef]);


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
            swipeableRef.current.closeIstantly();
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
                setzIndex(-20);
            }
        })
    };

    useEffect(() => {
        if (isLoading) {
            fadeIn();
        }
        else {
            scrollToTheTop();
            fadeOut();
            setzIndex(100);
        }
    }, [isLoading]);

    // Favourite article config
    const isFavourite = useSelector(state =>
        state.favouriteArticlesReducer.favouriteArticles.find(a => a.id === article.id) !== undefined);

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
        nextArticleFadeOutAnim();
        loadNextArticle();
    };

    const iconRef = useRef();
    renderRightActions = (progress, dragX) => {
        return (
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'black',
                flex: 1
            }}>
                <AnimatedIcon
                    name={'arrow-forward-circle'} color='dodgerblue' size={60} ref={iconRef}
                    style={{ alignSelf: 'flex-end', paddingRight: 20, transform: [{ scale: nextArticleInconScaleInterpolated }] }} />
            </View>
        );
    };

    return (
        <View style={{ backgroundColor: 'black'}}>
             <ArticleSwipable
                ref={swipeableRef}
                renderRightActions={this.renderRightActions}
                onSwipeableClose={() => console.log('close')}
                onSwipeableOpen={loadArticleSwipe}
                onSwipeableWillOpen={() =>{ setzIndex(100); }}>
                <ArticleScreen
                    article={article}
                    navigation={navigation}
                    scrollRef={scrollRef}
                    onFavouriteButtonToggle={toggleFavouriteButton}
                    isFavourite={isFavourite}
                    isLoading={isLoading} 
                />
            </ArticleSwipable>
            <LoadingComponent opacity={loadingFadeAnim} zIndex={zIndex} isLoading={isLoading} />      
        </View>
    )
}