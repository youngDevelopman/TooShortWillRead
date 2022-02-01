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
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal
} from 'react-native';


const AppButton = ({ onPress, title }) => (
  <TouchableOpacity activeOpacity={0.5}
  onPress={onPress} style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>{title}</Text>
  </TouchableOpacity>
);

const App: () => Node = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [article, setArticle] = useState({
    header: '',
    text: '',
    imageUrl: ''
  });

  const loadNextArticle = async () => {
    setIsLoading(true);
    const response = await fetch('https://tooshortwillreadwebapi20220129184421.azurewebsites.net/api/article/random');
    const responseJson = await response.json();
    console.log(responseJson);
    setArticle({
      ...article,
      header: responseJson.header,
      text: responseJson.text,
      imageUrl: responseJson.imageLink,
    });
    setIsLoading(false);
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
          stickyHeaderIndices={[0]}
        >
          <View style={{alignItems: 'flex-end'}}><AppButton onPress={loadNextArticle} title='Next article'/></View>
          <View style={styles.imageContainerStyle}>
            <Image
                style={[styles.headerImageStyle]}
                source={{ uri: article.imageUrl, }}
                onLoad={() => { console.log('on load'); setIsImageLoading(false);}}
            />        
          </View>
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
