/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useRef, useState } from 'react';
import type { Node } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useInterstitialAd, TestIds } from '@react-native-admob/admob';
import AppButton from './components/AppButton';
import Image from 'react-native-image-progress';
import ArticleService from './services/ArticleService';
import LoadingArticleModal from './components/LoadingArticleModal';
import Config from "react-native-config";
import CategoryList from './components/CategoryList';
import LineSeparator from './components/LineSeparator';



const App: () => Node = () => {
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
    Linking.openURL(`https://www.google.com/search?q=${article.header}`)
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
          <View style={styles.imageContainerStyle}>
            <Image
              style={[styles.headerImageStyle]}
              source={{ uri: article.imageUrl, }}
            />
          </View>
          <View style={styles.header}>
            <Text style={styles.headerText}
            >
              {article.header}
            </Text>
            <Icon.Button name="external-link" backgroundColor='black' onPress={openLink} fontSize='22' color='#379cdb'/>
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
  );
};

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
    borderRadius: 10
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

export default App;
