import React, { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, SafeAreaView, View, StatusBar, ScrollView, TouchableOpacity } from "react-native";
import CategoryList from "../components/CategoryList";
import ImageModal from "react-native-image-modal";
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import AppButton from "../components/AppButton";
import Icon from 'react-native-vector-icons/FontAwesome';

const ExternalLinkItem = ({ item, onPress }) => {
    return (
        <TouchableOpacity style={styles.externalLinkItem} activeOpacity={0.7} onPress={() => onPress(item.link)}>
            <View style={styles.externalLinkItemContainer}>
                <View style={{ flex: 1 }}>
                    <Icon name={item.icon} size={24} color="white"/>
                </View>
                <View style={{ flex: 10 }}>
                    <Text style={styles.linkTitle}>{item.title}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const ArticleScreen = ({ article, loadingComponent, header, navigation, scrollRef }) => {
    const links = () => {
        const linksToDisplay = [];

        const googleUrl = `https://www.google.com/search?q=${article.header}`;
        linksToDisplay.push({ title: 'Open on the Google page', link: googleUrl, icon: 'google' });

        if (article.originalUrl !== null && article.originalUrl !== undefined) {
            linksToDisplay.push({ title: 'Original article', link: article.originalUrl, icon: 'external-link' });
        }

        return linksToDisplay;
    };

    const openLink = (uri) => {
        navigation.navigate('Browser', {
            uri: uri
        });
    }

    const renderItem = useCallback(
        ({ item }) => (
            <ExternalLinkItem item={item} onPress={openLink}/>
        ),
        []
    );

    const renderSeparator = () => useCallback(
        <View
            style={{
                backgroundColor: 'white',
                height: 1,
                opacity: 0.6,
                marginHorizontal: 18,
            }}
        />
    );

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
        ),
    );
    // ref
    const bottomSheetRef = useRef(null);

    // variables
    const snapPoints = useMemo(() => ['25%'], []);

    const openExternalLinksModal = () => {
        bottomSheetRef.current.expand();
    }

    return (
        <View style={styles.container}>
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
                        <View>
                            <Text style={styles.text}>
                                {article.text}
                            </Text>
                        </View>
                        <AppButton onPress={openExternalLinksModal} title='More' style={{margin: 12}}/>
                    </ScrollView>
                </View>
                {loadingComponent}
                <BottomSheet
                    index={-1}
                    ref={bottomSheetRef}
                    snapPoints={snapPoints}
                    enablePanDownToClose={true}
                    backdropComponent={renderBackdrop}
                    backgroundStyle={styles.externalLinksContainer}
                >
                    <BottomSheetFlatList
                        data={links()}
                        keyExtractor={(i) => i.title}
                        renderItem={renderItem}
                        scrollEnabled={false}
                        ItemSeparatorComponent={renderSeparator}
                        ListFooterComponent={renderSeparator}
                    />
                </BottomSheet>
            </SafeAreaView>
        </View>
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
        fontFamily: 'Exo 2',
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
        fontFamily: 'Exo 2',
        lineHeight: 25
    },
    externalLinksContainer: {
        backgroundColor: 'dimgray'
    },
    itemContainer: {
        padding: 6,
        margin: 6,
        backgroundColor: "#eee",
    },
    externalLinkItem: {
        marginVertical: 8,
        marginHorizontal: 18,
    },
    externalLinkItemContainer: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
    },
    linkTitle: {
        color: '#FFFFFF',
        fontSize: 18,
    }
});



export default ArticleScreen;