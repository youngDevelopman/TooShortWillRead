/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import type { ReactNode } from 'react'; // ok
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FavouritesScreen from './screens/FavouritesScreen';
import FavouriteArticleScreen from './screens/FavouriteArticleScreen';
import BrowserScreen from './screens/BrowserScreen';
import { loadArticlesCount } from './redux/actions/loadArticlesCount';
import MainArticleScreen from './screens/MainArticleScreen';

const ArticleStack = createNativeStackNavigator();

function ArticleStackScreen() {
  return (
    <ArticleStack.Navigator>
      <ArticleStack.Screen name="Article" component={MainArticleScreen} options={{ headerShown: false }} />
    </ArticleStack.Navigator>
  )
}

const FavouriteArticleStack = createNativeStackNavigator();

function FavouriteArticlesScreen() {
  return (
    <FavouriteArticleStack.Navigator>
      <FavouriteArticleStack.Screen name="Favourites" component={FavouritesScreen} options={({ route }) => ({
        headerTintColor: 'dodgerblue',
        headerStyle: {
          backgroundColor: 'rgba(34,36,40,1)',
        }
      })} />
      <FavouriteArticleStack.Screen name="FavouriteArticle" component={FavouriteArticleScreen} options={{ headerShown: false }} />
    </FavouriteArticleStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarStyle: {
        backgroundColor: 'rgba(34,36,40,1)',
      }
    })}>
      <Tab.Screen name="Article" component={ArticleStackScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'book-outline'
            if (focused) {
              iconName = 'book'
            }
            return <Ionicons name={iconName} color='dodgerblue' size={25} />
          }
        }} />
      <Tab.Screen name="Favourites" component={FavouriteArticlesScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'star-outline'
            if (focused) {
              iconName = 'star'
            }
            return <Ionicons name={iconName} color='dodgerblue' size={25} />
          },
        }} />
    </Tab.Navigator>
  );
}

const MainStack = createNativeStackNavigator();
const App: () => ReactNode = () => {
  useEffect(() => {
    store.dispatch(loadArticlesCount());
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <MainStack.Navigator>
            <MainStack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
            <MainStack.Screen name="Browser" component={BrowserScreen} options={{ headerShown: false }} />
          </MainStack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
