import React, { useRef } from "react";
import { StyleSheet, Text, SafeAreaView, View, StatusBar, ScrollView, ActivityIndicator, Animated } from "react-native";
import CategoryList from "../components/CategoryList";
import LineSeparator from "../components/LineSeparator";
import ImageModal from "react-native-image-modal";
import ExternalLinks from "../components/ExternalLinks";

const ArticleScreen = ({ article, loadingComponent, header, navigation, scrollRef }) => {    
    const getGooglePageLink = () => {
        return `https://www.google.com/search?q=${article.header}`
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
                    {header}
                    <ImageModal
                        resizeMode="center"
                        modalImageResizeMode='center'
                        imageBackgroundColor='black'
                        style={{
                            width: '100%',
                            height: undefined,
                            aspectRatio: 1,
                        }}
                        source={{
                            uri: article.imageUrl,
                        }}
                    />
                    <View style={styles.header}>
                        <Text style={styles.headerText}
                        >
                            {article.header}
                        </Text>
                    </View>
                    <CategoryList data={article.categories} />
                    <LineSeparator />
                    <View>
                        <Text style={styles.text}>
                            {article.text}
                        </Text>
                    </View>
                    <LineSeparator />
                    <ExternalLinks googleUrl={getGooglePageLink()} originalUrl={article.originalUrl} navigation={navigation} />
                </ScrollView>
            </View>
            {loadingComponent}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000000',
        flex: 1,
    },
    headerImageStyle: {
        height: '100%',
        width: '100%',
    },
    imageContainerStyle: {
        height: 300,
        width: '100%',
        alignSelf: 'center',
        overflow: "hidden",
        borderRadius: 10,
        backgroundColor: 'white'
    },
    headerText: {
        textAlign: 'left',
        color: 'white',
        fontSize: 30,
        fontWeight: "bold",
        paddingTop: 10,
        paddingBottom: 10
    },
    header: {
        flexDirection: "row",
        alignItems: 'center'
    },
    text: {
        textAlign: 'auto',
        textAlignVertical: 'center',
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: 'Exo 2'
    }
});



export default ArticleScreen;