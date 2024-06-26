import React, { useState, useRef } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Linking, ActivityIndicator } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import WebView from "react-native-webview";

const BrowserScreen = ({ route, navigation }) => {
    const webviewRef = useRef(null);

    const { uri } = route.params;

    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);
    const [currentUrl, setCurrentUrl] = useState('');
    const [currentHostname, setCurrentHostname] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    backButtonHandler = () => {
        if (webviewRef.current) webviewRef.current.goBack()
    }

    frontButtonHandler = () => {
        if (webviewRef.current) webviewRef.current.goForward()
    }

    goBackHandler = () => {
        navigation.goBack();
    }

    openBrowser = () => {
        Linking.openURL(currentUrl);
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
        <View style={styles.containter}>
            <View style={styles.headerContainer}>
                <View style={{ flex: 1, }}>
                    <TouchableOpacity onPress={goBackHandler} style={styles.doneButtonContainer}>
                        <Text style={[styles.doneButton, {color: styles.secondaryColor}]}>Done</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 4, ...styles.hostnameContainer }}>
                    <Text style={styles.headerText}>
                        {currentHostname}
                    </Text>
                </View>
                <View style={{ flex: 1 }}>
                    <ActivityIndicator animating={isLoading} color='#585858'/>
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
                    setCurrentHostname(hostname);
                    setCurrentUrl(navState.url);
                }}
                onLoadStart={() => setIsLoading(true)}
                onLoad={() => setIsLoading(false)}
                allowsBackForwardNavigationGestures
            />
            <View
                style={styles.footerContainer}>
                <View style={styles.backAndForwardButtonsContainer}>
                    <Icon.Button
                        name="angle-left"
                        onPress={backButtonHandler}
                        backgroundColor={styles.primaryColor}
                        color={ canGoBack ? styles.secondaryColor : 'grey'}
                        size={35}
                        activeOpacity={0.3}
                        underlayColor={styles.primaryColor}
                    />
                    <Icon.Button
                        name="angle-right"
                        onPress={frontButtonHandler}
                        backgroundColor={styles.primaryColor}
                        color={ canGoForward ? styles.secondaryColor : 'grey'}
                        size={35}
                        activeOpacity={0.3}
                        underlayColor={styles.primaryColor} />
                </View>
                <View style={styles.goToBrowserContainer}>
                    <Icon.Button
                        brand
                        name="safari"
                        style={{ opacity: 1 }}
                        onPress={openBrowser}
                        backgroundColor={styles.primaryColor}
                        color={styles.secondaryColor}
                        size={35}
                        activeOpacity={0.3}
                        underlayColor={styles.primaryColor} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    primaryColor: 'dimgray',
    secondaryColor: 'dodgerblue',
    containter: {
        flex: 1,
        backgroundColor: 'dimgray'
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 15,
    },
    headerText: {
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 17,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 2
    },
    doneButtonContainer: {
        alignSelf: 'flex-start',
        paddingLeft: 10
    },
    doneButton: {
        fontWeight: 'bold',
        fontSize: 17
    },
    hostnameContainer: {
        backgroundColor: '#585858',
        borderRadius: 20
    },
    footerContainer: {
        flexDirection: "row",
        backgroundColor: 'dimgray',
        alignItems: 'center',
        marginBottom: 20,
    },
    backAndForwardButtonsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    goToBrowserContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    }
})

export default BrowserScreen;