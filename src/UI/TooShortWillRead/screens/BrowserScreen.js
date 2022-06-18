import React, { useState, useRef } from "react";
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import WebView from "react-native-webview";

const BrowserScreen = ({ route, navigation }) => {
    const webviewRef = useRef(null);

    const { uri } = route.params;

    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);
    const [currentUrl, setCurrentUrl] = useState('');

    backButtonHandler = () => {
        if (webviewRef.current) webviewRef.current.goBack()
    }

    frontButtonHandler = () => {
        if (webviewRef.current) webviewRef.current.goForward()
    }

    goBackHandler = () => {
        navigation.goBack();
    }

    const getHostname = (url) => {
        var hostname;
        //find & remove protocol (http, ftp, etc.) and get hostname

        if (url.indexOf("//") > -1) {
            hostname = url.split('/')[2];
        } else {
            hostname = url.split('/')[0];
        }

        //find & remove port number
        hostname = hostname.split(':')[0];
        //find & remove "?"
        hostname = hostname.split('?')[0];

        return hostname;
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'gray' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 50, marginBottom: 10, }}>
                <View style={{ flex: 1, }}>
                    <TouchableOpacity onPress={goBackHandler} style={{ alignSelf: 'flex-start', paddingLeft: 10 }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>Done</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 3 }}>
                    <Text style={styles.headerText}>
                        {currentUrl}
                    </Text>
                </View>
                <View
                    style={{ flex: 1 }}>
                </View>
            </View>
            <WebView style={styles.webView}
                source={{ uri: uri }}
                startInLoadingState={true}
                ref={webviewRef}
                onNavigationStateChange={navState => {
                    setCanGoBack(navState.canGoBack)
                    setCanGoForward(navState.canGoForward)
                    const hostname = getHostname(navState.url);
                    setCurrentUrl(hostname)
                }}
            />
            <View
                style={{
                    flexDirection: "row",
                    backgroundColor: 'grey',
                    alignItems: 'center',
                    marginBottom: 10,
                }}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Icon.Button
                        name="angle-left"
                        style={{ opacity: canGoBack ? 1 : 0.3, alignItems: 'center' }}
                        onPress={backButtonHandler}
                        backgroundColor='grey'
                        size={35}
                        activeOpacity={0.3}
                        underlayColor="grey" />
                    <Icon.Button
                        name="angle-right"
                        style={{ opacity: canGoForward ? 1 : 0.3 }}
                        onPress={frontButtonHandler}
                        backgroundColor='grey'
                        size={35}
                        activeOpacity={0.3}
                        underlayColor="grey" />
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent:'flex-end' }}>
                    <Icon.Button
                        name="safari"
                        style={{ opacity: 1 }}
                        backgroundColor='grey'
                        size={35}
                        activeOpacity={0.3}
                        underlayColor="grey" />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerText: {
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 17,
        color: 'white',
        fontWeight: 'bold'
    },
    containter: {
        flex: 1
    },
    webView: {
        marginTop: 0,
    }
})

export default BrowserScreen;