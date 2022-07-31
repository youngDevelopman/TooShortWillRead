import React from "react";
import { StyleSheet, Text, FlatList, View, TouchableOpacity, Image } from "react-native";
import CategoryList from "../components/CategoryList";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const Item = ({ item, onPress }) => {
    return (
        <TouchableOpacity style={styles.item} activeOpacity={0.7} onPress={() => onPress(item.id)}>
            <View style={styles.itemContainer}>
                <View style={{ flex: 2.1 }}>
                    <Image
                        style={styles.image}
                        source={{ uri: item.imageUrl }}
                        resizeMode={"cover"} // <- needs to be "cover" for borderRadius to take effect on Android
                    />
                </View>
                <View style={{ flex: 5 }}>
                    <Text style={styles.headerText}>{item.header}</Text>
                    <CategoryList data={item.categories.slice(0, 2)} style={{ marginTop: 10 }} />
                </View>
            </View>
        </TouchableOpacity>
    )
}



const renderSeparator = () => (
    <View
        style={{
            backgroundColor: 'white',
            height: 1,
            opacity: 0.6,
            marginHorizontal: 16,
        }}
    />
);

const FavouritesScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { favouriteArticles } = useSelector(state => state.favouriteArticlesReducer);

    const openFavouriteArticle = (articleId) => {
        navigation.navigate('FavouriteArticle', {
            articleId: articleId
        });
    };

    const renderItem = ({ item }) => {
        return <Item item={item} onPress={openFavouriteArticle} />
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={favouriteArticles}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={renderSeparator}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flex: 1,
    },
    item: {
        marginVertical: 8,
        marginHorizontal: 16,
    },
    image: {
        width: 100,
        height: 100,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 75,
    },
    headerText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'Exo 2'
    },
    itemContainer: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
    }
})

export default FavouritesScreen;