import React from "react";
import { StyleSheet, Text } from "react-native";

const Category = (props) => {
    return (
        <Text style={styles.text}>#{props.title}</Text>
    )
};

const styles = StyleSheet.create({
    text: {
        backgroundColor: "#383837"
    }
});

export default Category;