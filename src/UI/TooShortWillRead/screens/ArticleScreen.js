import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, SafeAreaView, View, StatusBar, ScrollView } from "react-native";
import AppButton from "../components/AppButton";
import CategoryList from "../components/CategoryList";
import LineSeparator from "../components/LineSeparator";
import LoadingArticleModal from "../components/LoadingArticleModal";
import ImageModal from "react-native-image-modal";
import Icon from 'react-native-vector-icons/FontAwesome';
import Config from "react-native-config";
import { useInterstitialAd, TestIds } from '@react-native-admob/admob';
import ArticleService from "../services/ArticleService";

const ArticleScreen = ({ navigation }) => {

    const scrollRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [article, setArticle] = useState({
        articleId: '',
        header: '',
        text: '',
        imageUrl: '',
        categories: []
    });

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
        //console.log(await AsyncStorage.getAllKeys());
        setIsLoading(true);
        const articleData = await ArticleService.loadNewArticleAsync();
        setArticle({
            ...article,
            articleId: articleData.id,
            header: articleData.header,
            text: articleData.text,
            imageUrl: articleData.imageLink,
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

    const openLink = () => {
        navigation.navigate('Browser', {
            uri: `https://www.google.com/search?q=${article.header}`
        });
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
                    <View style={{ alignItems: 'flex-end' }}>
                        <AppButton onPress={loadNextArticle} title='Next article' />
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
                        <Icon.Button name="external-link" backgroundColor='black' onPress={openLink} fontSize='22' color='#379cdb' />
                    </View>
                    <CategoryList data={article.categories} />
                    <LineSeparator />
                    <View>
                        <Text style={styles.text}>
                            {article.text}
                        </Text>
                    </View>
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
      fontSize: 22,
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