import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, Dimensions, View, StatusBar, ScrollView, TouchableOpacity, Animated, Image, Button } from "react-native";
import CategoryList from "../components/CategoryList";
import BottomSheetModal, { BottomSheetBackdrop, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Portal, PortalHost } from '@gorhom/portal';
import FastImage from "react-native-fast-image";
const { width, height } = Dimensions.get('screen');

const ExtraSection = ({ style, onExternalLinksOpen, onFavouriteButtonToggle, isFavourite }) => {
    return (
        <View style={
            [style, {
                flexDirection: 'row',
                backgroundColor: "#383837",
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 8,
                borderRadius: 20,
                marginHorizontal: 120,
                marginVertical: 10,
                shadowOffset: {
                    width: 0,
                    height: 0
                },
                shadowOpacity: 0.3,
                shadowRadius: 13,
                shadowColor: 'white'

            }]}>
            <View style={{

            }}>
                <TouchableOpacity onPress={onExternalLinksOpen} activeOpacity={0.7}>
                    <Text style={{
                        fontSize: 18,
                        color: "#fff",
                        fontWeight: "bold",
                        alignSelf: "center",
                        textTransform: "uppercase"
                    }}>More</Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginHorizontal: 5, marginVertical: 5 }}>
                <Ionicons name="remove-outline" size={25} style={{ transform: [{ rotate: '90deg' }] }} />
            </View>
            <View>
                <TouchableOpacity onPress={onFavouriteButtonToggle} activeOpacity={0.7}>
                    <Ionicons name={isFavourite ? 'star' : 'star-outline'} size={22} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const ExternalLinkItem = ({ item, onPress }) => {
    return (
        <TouchableOpacity style={styles.externalLinkItem} activeOpacity={0.7} onPress={() => onPress(item.link)}>
            <View style={styles.externalLinkItemContainer}>
                <View style={{ flex: 1 }}>
                    <Icon name={item.icon} size={24} color="white" />
                </View>
                <View style={{ flex: 10 }}>
                    <Text style={styles.linkTitle}>{item.title}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

const ArticleScreen = ({ article, onFavouriteButtonToggle, isFavourite, navigation, scrollRef }) => {
    const [bottomActions, setBottomActions] = useState(null);
    const [scrollViewHeight, setScrollViewHeight] = useState(null);
    const [topEdge, setTopEdge] = useState(null);

    useEffect(() => {
        if (bottomActions !== null && scrollViewHeight !== null) {
            const bottomTabDiff = height - scrollViewHeight;
            const val = Math.abs(bottomActions.y - height + bottomActions.height + bottomTabDiff);
            if(val > 0) {
                setTopEdge(val);
            }
        }
    }, [bottomActions, scrollViewHeight, topEdge])

    const pan = useRef(new Animated.ValueXY()).current;

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
        bottomSheetRef.current.close();
        navigation.navigate('Browser', {
            uri: uri
        });
    }

    const renderItem = useCallback(
        ({ item }) => (
            <ExternalLinkItem item={item} onPress={openLink} />
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
        <View style={{}}>
            <StatusBar backgroundColor="#FFFFFF" barStyle='light-content' />
            <View 
            onLayout={ev => {
                setScrollViewHeight(ev.nativeEvent.layout.height);
            }}>
                <Animated.ScrollView
                    ref={scrollRef}
                    showsVerticalScrollIndicator={false}
                    contentOffset={{ x: 0, y: height }}
                    scrollEventThrottle={1}
                    onScroll={Animated.event(
                        [{
                            nativeEvent:
                            {
                                contentOffset: { y: pan.y },
                            }
                        }],
                        {
                            useNativeDriver: false,
                        }
                    )}
                >
                    <AnimatedFastImage
                        resizeMode={FastImage.resizeMode.cover}
                        modalImageResizeMode='center'
                        imageBackgroundColor='black'
                        scrollEventThrottle={1}
                        alwaysBounceVertical={false}
                        style={{
                            width: Dimensions.get('window').width,
                            height: undefined,
                            aspectRatio: 1,
                            transform: [
                                {
                                    translateY: pan.y.interpolate({
                                        inputRange: [-1000, 0],
                                        outputRange: [-100, 0],
                                        extrapolate: 'clamp',
                                    }),
                                },
                                {
                                    scale: pan.y.interpolate({
                                        inputRange: [-3000, 0],
                                        outputRange: [5, 1],
                                        extrapolate: 'clamp',
                                    }),
                                },
                            ]
                        }}
                        source={{
                            uri: article.imageUrl,
                        }}
                    />
                    <Animated.View style={
                        {
                            paddingLeft: 10,
                            paddingRight: 10,
                            transform: [
                                {
                                    translateY: pan.y.interpolate({
                                        inputRange: [-1000, 0],
                                        outputRange: [250, 0],
                                        extrapolate: 'clamp',
                                    }),
                                },
                            ],
                        }}>
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
                        <View
                            style={styles.extraSection}
                            onLayout={ev => {
                                ev.target.measure(
                                    (x, y, width, height, pageX, pageY) => {
                                        setBottomActions({ x: pageX, y: pageY, height });
                                    },
                                );
                            }}>
                        </View>
                    </Animated.View>
                    <Portal>
                        <BottomSheetModal
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
                        </BottomSheetModal>
                    </Portal>
                    <PortalHost name="custom_host" />
                </Animated.ScrollView>
            </View>
            {topEdge && <Animated.View style={
                [styles.extraSection, {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    transform: [
                        {
                            translateY: pan.y.interpolate({
                                inputRange: [-1, 0, topEdge - 1, topEdge, topEdge + 1],
                                outputRange: [0, 0, 0, 0, -1],
                            }),
                        }
                    ]
                }]}>
                <ExtraSection
                    onExternalLinksOpen={openExternalLinksModal}
                    onFavouriteButtonToggle={onFavouriteButtonToggle}
                    isFavourite={isFavourite}
                />
            </Animated.View>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000000'
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
        backgroundColor: 'dimgray',
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
        alignItems: 'center'
    },
    linkTitle: {
        color: '#FFFFFF',
        fontSize: 18,
    },
    extraSection: {
        height: 60,
    }
});



export default ArticleScreen;