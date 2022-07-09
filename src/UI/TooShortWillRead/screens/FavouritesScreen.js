import React from "react";
import { StyleSheet, Text, FlatList, View, TouchableOpacity, Image } from "react-native";
import CategoryList from "../components/CategoryList";
import { useSelector } from "react-redux";

const DATA = [
    {
        id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
        title: "Yamagata Arimoto",
        imageUrl: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
        categories: ['Health & Medicine', 'Politics, Law & Government']
    },
    {
        id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
        title: "Northern Mariana Islandsaaaaaaaaaaaaaaaa",
        imageUrl: 'https://i.picsum.photos/id/1020/4288/2848.jpg?hmac=Jo3ofatg0fee3HGOliAIIkcg4KGXC8UOTO1dm5qIIPc',
        categories: ['category 1', 'category 2', 'category 3', 'category 4']
    },
    {
        id: "58694a0f-3da1-471f-bd96-145571e29d72",
        title: "Map",
        imageUrl: 'https://i.picsum.photos/id/1025/4951/3301.jpg?hmac=_aGh5AtoOChip_iaMo8ZvvytfEojcgqbCH7dzaz-H8Y',
        categories: ['category 1', 'category 2', 'category 3', 'category 4', 'category 5']
    },
    {
        id: "58694a0f-3da1-471f-bd96-145571e29d82",
        title: "Denali",
        imageUrl: 'https://i.picsum.photos/id/1025/4951/3301.jpg?hmac=_aGh5AtoOChip_iaMo8ZvvytfEojcgqbCH7dzaz-H8Y',
        categories: ['category 1', 'category 2', 'category 3', 'category 4', 'category 5']
    },
    {
        id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f73",
        title: "Kanye",
        imageUrl: 'https://i.picsum.photos/id/1020/4288/2848.jpg?hmac=Jo3ofatg0fee3HGOliAIIkcg4KGXC8UOTO1dm5qIIPc',
        categories: ['category 1', 'category 2', 'category 3', 'category 4']
    },
    {
        id: "bd7acbea-c1b1-46c2-aed5-3ad53abb29ba",
        title: "Yamagata Arimoto",
        imageUrl: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
        categories: ['Health & Medicine', 'Politics, Law & Government']
    },
];

const Item = ({ item }) => {
    return (
        <TouchableOpacity style={styles.item} activeOpacity={0.7}>
            <View style={styles.itemContainer}>
                <View style={{ flex: 2.1 }}>
                    <Image
                        style={styles.image}
                        source={{ uri: item.imageUrl }}
                        resizeMode={"cover"} // <- needs to be "cover" for borderRadius to take effect on Android
                    />
                </View>
                <View style={{ flex: 5 }}>
                    <Text style={styles.headerText}>{item.title}</Text>
                    <CategoryList data={item.categories.slice(0, 2)} style={{ marginTop: 10 }} />
                </View>
            </View>
        </TouchableOpacity>
    )
}

renderSeparator = () => (
    <View
        style={{
            backgroundColor: 'white',
            height: 1,
            opacity: 0.6,
            marginHorizontal: 16,
        }}
    />
);

const FavouritesScreen = () => {
    const  { favouriteArticles } = useSelector(state => state.favouriteArticlesReducer)
    console.log('favourite articles from the store', favouriteArticles);
    const renderItem = ({ item }) => {
        return <Item item={item} />
    }
    return (
        <View style={styles.container}>
            <FlatList
                data={favouriteArticles}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={this.renderSeparator}
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
        color: 'white'
    },
    itemContainer: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
    }
})

export default FavouritesScreen;