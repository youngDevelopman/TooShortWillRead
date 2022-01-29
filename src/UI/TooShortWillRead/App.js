/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useRef } from 'react';
import type { Node } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Animated
} from 'react-native';

const App: () => Node = () => {
  const title = 'Test title'
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ paddingLeft: 10, paddingRight: 10 }}>
        <StatusBar backgroundColor="#FFFFFF" barStyle='light-content' />
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          overScrollMode={'never'}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {
                  y: scrollY
                }
              },
            }
          ])}
          scrollEventThrottle={16}
        >
          <Animated.Image
            style={[styles.headerImageStyle]}
            source={{ uri: 'https://www.dexerto.com/wp-content/uploads/2021/11/17/rockstar-games-gta-promise.jpeg' }} />
          <Animated.Text style={styles.headerText}
          >
            {title}
          </Animated.Text>

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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a sem neque. Sed rutrum ligula tortor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nunc dignissim id eros et porttitor. Sed mattis magna ac felis semper, vitae faucibus ante egestas. Aenean ultricies, tortor eget malesuada cursus, nisi odio aliquam libero, eu eleifend lacus leo porttitor metus. Vivamus sed elementum turpis. Praesent id lectus lorem. Donec sit amet vehicula orci, in accumsan ante. Praesent finibus, ante id tempus finibus, ex tellus maximus nisi, nec scelerisque dolor augue at elit. Sed consequat ipsum eros, et cursus eros dapibus vitae. Donec imperdiet massa eu malesuada semper. Praesent rhoncus magna vel metus auctor cursus. Integer pellentesque, nulla in ornare pharetra, eros ipsum sollicitudin ligula, nec tincidunt quam diam at eros. Nunc ut est faucibus, mollis arcu ut, accumsan ex.

              Curabitur faucibus arcu sed lectus euismod molestie.

              {'\n\n'}Phasellus quis orci sed odio commodo blandit. Fusce aliquet pretium odio, sit amet lobortis justo pellentesque ut. Morbi eget felis in lacus elementum gravida interdum vitae eros. Phasellus sollicitudin finibus leo eu aliquet. Maecenas sit amet consectetur justo. Maecenas tempus vel purus ac egestas. In hac habitasse platea dictumst. Morbi pharetra pulvinar nunc, et imperdiet turpis commodo vel. Proin eu lobortis tellus.

              Maecenas non placerat eros. Maecenas placerat sem ac ligula semper pretium. Pellentesque urna metus, mattis a nulla vitae, blandit facilisis tortor. Praesent faucibus, diam at malesuada mollis, sapien sapien tincidunt enim, nec blandit ante tellus ac ante. Nunc dictum sagittis dui ac ullamcorper. Donec at elit non lectus suscipit ornare. Proin bibendum consectetur cursus. Vivamus mi metus, ullamcorper sed diam eget, imperdiet sollicitudin felis. Nam malesuada tortor elit, auctor varius massa ullamcorper eu. Curabitur ac consequat neque. Nam sed nibh convallis tortor vestibulum efficitur.

              Maecenas tincidunt magna sed ipsum condimentum tempus. Etiam rhoncus mollis mauris, in dictum quam egestas sit amet. Aenean porta a neque eget vulputate. Suspendisse potenti. In viverra arcu nibh, at elementum dui tincidunt vitae. Praesent non lacinia tellus, eget ullamcorper libero. Donec eu metus eu tellus viverra bibendum. Duis odio eros, tristique eget mollis laoreet, suscipit at nisi. Aenean ultricies tempus aliquam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Cras varius dignissim tellus a eleifend. Etiam sed scelerisque massa, in rhoncus tortor.

              Cras suscipit risus eu leo vestibulum semper. Etiam nec accumsan nisl. Vivamus vitae diam mollis, porta erat nec, mattis quam. Maecenas posuere feugiat ipsum, et dapibus magna finibus vitae. Cras pulvinar quam ut imperdiet venenatis. Vestibulum eu porta ante. In posuere, urna quis lobortis euismod, lectus purus vestibulum lorem, pellentesque mattis turpis nibh non neque. Curabitur tempor lectus tortor. Proin ex augue, accumsan sed consequat ut, varius id tellus. Aenean euismod, libero et placerat scelerisque, lacus massa tempor purus, vitae malesuada arcu velit et tortor.
            </Text>
          </View>
        </Animated.ScrollView>
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
