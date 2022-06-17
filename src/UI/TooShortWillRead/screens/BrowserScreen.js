import React from "react";
import { Text, View, StyleSheet, SafeAreaView } from "react-native";
import WebView from "react-native-webview";

const BrowserScreen = ({ route, navigation }) => {
    const { uri } = route.params;
    return (
        <SafeAreaView style={styles.containter}>
            <WebView style={styles.webView}
                source={{ uri: uri }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    containter: {
        flex: 1
    },
    webView: {
        marginTop: 0,
    }
})

export default BrowserScreen;