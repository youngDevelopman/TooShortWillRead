/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type { Node } from 'react';
import { Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ArticleScreen from './screens/ArticleScreen';
import BrowserScreen from './screens/BrowserScreen';

const ArticleStack = createNativeStackNavigator();

function ArticleStackScreen() {
  return (
    <ArticleStack.Navigator>
      <ArticleStack.Screen name="Article" component={ArticleScreen} options={{ headerShown: false }} />
      <ArticleStack.Screen name="Browser" component={BrowserScreen} options={{ headerShown: false }} />
    </ArticleStack.Navigator>
  )
}

const Tab = createBottomTabNavigator();

function FavouriteArticlesScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Favourite Articles!</Text>
    </View>
  );
}

const App: () => Node = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: 'rgba(34,36,40,1)',
        },
        tabBarIcon: ({ focused, color, size }) => {
          console.log('TAB NAvigator')
        },
      })}>
        <Tab.Screen name="Article" component={ArticleStackScreen}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName = 'book-outline'
              if(focused){
                iconName = 'book'
              }
              return <Ionicons name={iconName} color='dodgerblue' size={25} />
            }
          }} />
        <Tab.Screen name="Favourites" component={FavouriteArticlesScreen}
          options={{
            tabBarShowLabel: false,
            tabBarLabel: 'Home',
            tabBarIcon: ({ focused, color, size }) => {
              let iconName = 'star-outline'
              if(focused){
                iconName = 'star'
              }
              return <Ionicons name={iconName} color='dodgerblue' size={25} />
            },
          }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
