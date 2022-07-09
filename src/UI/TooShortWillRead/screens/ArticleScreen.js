import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, SafeAreaView, View, StatusBar, ScrollView } from "react-native";
import AppButton from "../components/AppButton";
import CategoryList from "../components/CategoryList";
import LineSeparator from "../components/LineSeparator";
import LoadingArticleModal from "../components/LoadingArticleModal";
import ImageModal from "react-native-image-modal";
import Config from "react-native-config";
import { useInterstitialAd, TestIds } from '@react-native-admob/admob';
import ArticleService from "../services/ArticleService";
import FavouriteArticlesAsyncStorage from "../services/FavouriteArticlesAsyncStorage";
import ExternalLinks from "../components/ExternalLinks";
import Icon from "react-native-vector-icons/Ionicons";
import { addFavouriteArticle, removeFavouriteArticle } from "../redux/actions/favouritesArticlesActions";
import { useDispatch, useSelector } from "react-redux";

const ArticleScreen = ({ navigation }) => {

    const scrollRef = useRef();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [article, setArticle] = useState({
        articleId: '',
        header: '',
        text: '',
        imageUrl: '',
        originalUrl: '',
        categories: []
    });
    
    const isFavourite  = useSelector(state => 
        state.favouriteArticlesReducer.favouriteArticles.find(a => a.articleId === article.articleId) != undefined);

    const [articlesShownBeforeAd, setArticlesShownBeforeAd] = useState(0);
    const AD_TO_SHOW_THESHOLD = 5;
    const { adLoaded, show, load } = useInterstitialAd(
        Config.INTERSTITIAL_AD_UNIT,
        {
            requestOptions: {
                requestNonPersonalizedAdsOnly: true,
            },
        }
    );

    const scrollToTheTop = () => {
        scrollRef.current?.scrollTo({
            y: 0,
            animated: false,
        });
    }

    const loadNextArticle = async () => {
        setIsLoading(true);
        const articleData = await ArticleService.loadNewArticleAsync();
        setArticle({
            ...article,
            articleId: articleData.id,
            header: articleData.header,
            text: articleData.text,
            imageUrl: articleData.imageLink,
            originalUrl: articleData.originalLink,
            categories: articleData.categories,
        });
        
        scrollToTheTop();
        setIsLoading(false);
        setArticlesShownBeforeAd(articlesShownBeforeAd + 1);
    }

    useEffect(() => {
        //clearAppData();
        loadNextArticle();
        load();
    }, []);

    const showAd = () => {
        console.log("ADD LOADED", adLoaded)
        if (adLoaded && articlesShownBeforeAd >= AD_TO_SHOW_THESHOLD) {
            console.log("SHOW ADD")
            show()
            load()
            setArticlesShownBeforeAd(0);
        }
    }

    const toggleFavouriteButton = () => {
        if(isFavourite) {
            dispatch(removeFavouriteArticle(article.articleId));
        }
        else {
            const articleToAdd = { 
                articleId: article.articleId, 
                header: article.header, 
                imageUrl: article.imageUrl, 
                categories: article.categories 
            };
            dispatch(addFavouriteArticle(articleToAdd));
        }
    }

    const getGooglePageLink = () => {
        return `https://www.google.com/search?q=${article.header}`
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={{ paddingLeft: 10, paddingRight: 10, flex: 1 }}>
                <StatusBar backgroundColor="#FFFFFF" barStyle='light-content' />
                <ScrollView
                    ref={scrollRef}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    stickyHeaderIndices={[0]}
                >
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
                            <Icon name={isFavourite ? 'star' : 'star-outline'}  color='dodgerblue' size={30} onPress={toggleFavouriteButton} />
                            <AppButton onPress={loadNextArticle} title='Next article' />
                        </View>
                    </View>
                    <ImageModal
                        resizeMode="center"
                        modalImageResizeMode='center'
                        imageBackgroundColor='black'
                        style={{
                            width: '100%',
                            height: undefined,
                            aspectRatio: 1,
                        }}
                        source={{
                            uri: article.imageUrl,
                        }}
                    />
                    <View style={styles.header}>
                        <Text style={styles.headerText}
                        >
                            {article.header}
                        </Text>
                    </View>
                    <CategoryList data={article.categories} />
                    <LineSeparator />
                    <View>
                        <Text style={styles.text}>
                            {article.text}
                        </Text>
                    </View>
                    <LineSeparator />
                    <ExternalLinks googleUrl={getGooglePageLink()} originalUrl={article.originalUrl} navigation={navigation} />
                </ScrollView>
                <LoadingArticleModal isLoading={isLoading} showAd={showAd} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000000',
        flex: 1,
    },
    headerImageStyle: {
        height: '100%',
        width: '100%',
    },
    imageContainerStyle: {
        height: 300,
        width: '100%',
        alignSelf: 'center',
        overflow: "hidden",
        borderRadius: 10,
        backgroundColor: 'white'
    },
    headerText: {
        textAlign: 'left',
        color: 'white',
        fontSize: 30,
        fontWeight: "bold",
        paddingTop: 10,
        paddingBottom: 10
    },
    header: {
        flexDirection: "row",
        alignItems: 'center'
    },
    text: {
        textAlign: 'auto',
        textAlignVertical: 'center',
        color: '#FFFFFF',
        fontSize: 18
    }
});



export default ArticleScreen;