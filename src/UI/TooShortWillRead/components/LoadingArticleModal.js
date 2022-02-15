import React from "react";
import { StyleSheet, Modal, View, ActivityIndicator, Text } from "react-native";

const LoadingArticleModal = (props) => {
    return (
        <Modal visible={props.isLoading} style={{ backgroundColor: "black", }} animationType='fade'>
            <View style={styles.modalBackground}>
                <ActivityIndicator animating={props.isLoading} color="white" size="large" />
                <Text style={styles.text}> Loading the next article...</Text>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    text: {
        textAlign: 'auto',
        textAlignVertical: 'center',
        color: '#FFFFFF',
        fontSize: 18
      },
      modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'black',
        zIndex: 1000
      }
});

export default LoadingArticleModal;