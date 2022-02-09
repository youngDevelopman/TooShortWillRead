/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useRef, useState } from 'react';
import WebView from 'react-native-webview';
import type { Node } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Linking
} from 'react-native';
import Image from 'react-native-image-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppButton = ({ onPress, title }) => (
  <TouchableOpacity activeOpacity={0.5}
  onPress={onPress} style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>{title}</Text>
  </TouchableOpacity>
);

const App: () => Node = () => {
  const LOAD_ARTICLES_ATTEMPS_TRESHOLD = 10;
  const scrollRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [article, setArticle] = useState({
    header: '',
    text: '',
    imageUrl: ''
  });

  const scrollToTheTop = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: false,
    });
  }

  const addReadArticle = async (articleId) => {
    try {
      await AsyncStorage.setItem(
        `@ReadArticles:${articleId}`,
        'article'
      );
      console.log('saved');
    } catch (error) {
      // Error saving data
      console.log('error', error)
    }
  }

  const loadNextArticle = async () => {
    console.log(await AsyncStorage.getAllKeys());
    setIsLoading(true);
    let isUnique = false;
    let attempts = 0;
    let articleData = {};
    do
    {
      const response = await fetch('https://tooshortwillreadwebapi20220129184421.azurewebsites.net/api/article/random');
      articleData = await response.json();
      const articleId = `@ReadArticles:${articleData.header}`;
      console.log(articleId)
      isUnique = await AsyncStorage.getItem(articleId) == null;
      AsyncStorage.getItem(articleId, (error, result) => {
        if(error) console.error('Something went wrong!');
        else if(result) console.log('Getting key was successfull', result);
        else if(result === null) console.log('Key does not exists!');
      });
      console.log('get article result', isUnique)
      if(await AsyncStorage.getItem(articleId) == null){
        isUnique = true;
      }
      console.log('attemp number', attempts)
      attempts++;
    } while(!isUnique && attempts <= LOAD_ARTICLES_ATTEMPS_TRESHOLD)
    setArticle({
      ...article,
      header: articleData.header,
      text: articleData.text,
      imageUrl: articleData.imageLink,
    });
    scrollToTheTop();
    await addReadArticle(articleData.header);
    setIsLoading(false);
  }

  useEffect(() => {
      loadNextArticle();
  }, []);

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
          <View style={{alignItems: 'flex-end'}}><AppButton onPress={loadNextArticle} title='Next article'/></View>
          <View style={styles.imageContainerStyle}>
            <Image
                style={[styles.headerImageStyle]}
                source={{ uri: article.imageUrl, }}
            />        
          </View>
          <Text style={styles.headerText}
          >
            {article.header}
          </Text>
          <TouchableOpacity onPress={openLink}>
              <Text style={{color: '#d0b7f7', fontSize: 18, fontWeight:'800'}}>Open this article in a browser</Text>
          </TouchableOpacity>
          <View >
          <View
            style={{
              borderBottomColor: 'white',
              borderBottomWidth: 0.5,
              width: '40%',
              marginTop: 10,
              marginBottom: 10,
            }}
          />
            <Text style={styles.text}>
              {article.text}
            </Text>
          </View>
        </ScrollView>
        <Modal visible={isLoading} style={{ backgroundColor: "black", }} animationType='fade'>
          <View style={styles.modalBackground}>
            <ActivityIndicator animating={isLoading} color="white" size="large"/>
            <Text style={styles.text}> Loading the next article...</Text>
          </View>
        </Modal>
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
  imageContainerStyle :{
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
    backgroundColor: '#9E2A10',
    fontSize: 22,
    alignContent: 'center',
    alignItems: 'center'
  },
  text: {
    textAlign: 'auto',
    textAlignVertical: 'center',
    color: '#FFFFFF',
    fontSize: 18
  },
  nextArticleButton: {
    alignSelf: 'flex-end',
    fontWeight: "bold",
  },
  // app button
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#383837",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 10, 
    marginTop: 10,
    marginBottom: 10
  },
  appButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'black',
    zIndex: 1000
  }
});

export default App;
