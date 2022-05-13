import React from "react";
import { View, StyleSheet } from "react-native";

const LineSeparator = (props) => {
    return (
        <View style={styles.line}/>
    );
}

const styles = StyleSheet.create({
    line: {
        borderBottomColor: 'white',
        borderBottomWidth: 0.5,
        width: '40%',
        marginTop: 10,
        marginBottom: 10,
    }
});

export default LineSeparator;