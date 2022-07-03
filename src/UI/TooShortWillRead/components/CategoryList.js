import React from "react";
import { StyleSheet, Text, View } from "react-native";

const CategoryList = (props) => {
    const renderList = props.data.map((item) => {
        return (
            <View style={{paddingRight: 8, paddingBottom: 8 }}>
                <View style={styles.category}>
                    <Text style={styles.text}>
                        {item}
                    </Text>
                </View>
            </View>
        )
    })

    return (
        <View style={[styles.container, props.style]}>
            {renderList}
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    category: {
        justifyContent: 'center',
        borderRadius: 20,
        overflow: 'hidden'
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

export default CategoryList;