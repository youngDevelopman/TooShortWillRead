import React, {useRef} from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";

const CategoryListScrollable = (props) => {
    const ref = useRef();
    const renderItem = ({ item }) => (
        <View style={styles.category}>
            <Text style={styles.text}>
                {item}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={props.data}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                ref={ref}
                onContentSizeChange={() => {
                    ref.current.scrollToIndex({ index: 0, animated: false })
                }}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 5
    },
    category: {
        justifyContent: 'center',
        borderRadius: 20,
        overflow: 'hidden',
        marginRight: 10
    },
    text: {
        elevation: 8,
        backgroundColor: "#383837",
        fontSize: 15,
        textAlign: 'center',
        padding: 7,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",

    }
});

export default CategoryListScrollable;