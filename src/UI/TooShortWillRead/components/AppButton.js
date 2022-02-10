import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const AppButton = ({ onPress, title }) => (
    <TouchableOpacity activeOpacity={0.5}
    onPress={onPress} style={styles.appButtonContainer}>
      <Text style={styles.appButtonText}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    appButtonContainer: {
        elevation: 8,
        backgroundColor: "#383837",
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 10, 
        marginTop: 10,
        marginBottom: 10
      },
      appButtonText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
      }
});

export default AppButton;