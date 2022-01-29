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
  useColorScheme,
  View,
  Image
} from 'react-native';

const App: () => Node = () => {
  const [article, setArticle] = useState({
    header: '',
    text: '',
    imageUrl: ''
  });

  const loadNextArticle = async () => {
    const response = await fetch('https://tooshortwillreadwebapi20220129184421.azurewebsites.net/api/article/random');
    const responseJson = await response.json();
    console.log(responseJson);
    setArticle({
      ...article,
      header: responseJson.header,
      text: responseJson.text,
      imageUrl: responseJson.imageLink,
    });
  }

  useEffect(() => {
      loadNextArticle();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ paddingLeft: 10, paddingRight: 10, flex: 1 }}>
        <StatusBar backgroundColor="#FFFFFF" barStyle='light-content' />
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          <Image
            style={[styles.headerImageStyle]}
            source={{ uri: article.imageUrl }} />
          <Text style={styles.headerText}
          >
            {article.header}
          </Text>

          <View >
          <View
            style={{
              borderBottomColor: 'white',
              borderBottomWidth: 0.5,
              width: '40%',
              marginBottom: 10
            }}
          />
            <Text style={styles.text}>
              {article.text}
            </Text>
          </View>
        </ScrollView>
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
    height: 300,
    width: '100%',
    borderRadius: 10,
    alignSelf: 'center',
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
});

export default App;
