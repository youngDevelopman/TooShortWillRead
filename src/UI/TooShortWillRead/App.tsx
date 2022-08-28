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
import InformationScreen from './screens/InformationScreen';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { PortalProvider } from '@gorhom/portal';

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
      <FavouriteArticleStack.Screen name="Favourites List" component={FavouritesScreen} options={({ route }) => ({
        title: "Favorites",
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: 'black',
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
        backgroundColor: 'black',
        borderTopWidth: 0,
      }
    })}>
      <Tab.Screen name="Main Article" component={ArticleStackScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'book-outline'
            if (focused) {
              iconName = 'book'
            }
            return <Ionicons name={iconName} color='white' size={25} />
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
            return <Ionicons name={iconName} color='white' size={25} />
          },
        }} />
      <Tab.Screen name="Info" component={InformationScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'information-circle-outline'
            if (focused) {
              iconName = 'information-circle'
            }
            return <Ionicons name={iconName} color='white' size={30} />
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
        <PortalProvider>
          <BottomSheetModalProvider>
            <NavigationContainer>
              <MainStack.Navigator>
                <MainStack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
                <MainStack.Screen name="Browser" component={BrowserScreen} options={{ headerShown: false }} />
              </MainStack.Navigator>
            </NavigationContainer>
          </BottomSheetModalProvider>
        </PortalProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
