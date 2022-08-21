import React from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LineSeparator from "../components/LineSeparator";

const InformationScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={
                {
                    fontSize: 20, 
                    color: 'white',
                    paddingBottom: 10,
                    paddingTop: 50
                    }}>
                        Thanks for downloading {'\n'} Too Short; Will Read!
            </Text>
            <LineSeparator/>
            <Text style={
                { 
                    color: 'white', 
                    fontSize: 20, 
                    paddingTop: 15, 
                    marginHorizontal: 10, 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    textAlign: "center" 
                }
            }>
                The application is in its early stage of the  development, so we plan to add more features such as:
            </Text>
            <FlatList style={
                {
                    paddingTop: 20, 
                    marginHorizontal: 30
                }}
                scrollEnabled={false}
                data={[
                    { key: 'Recommendation system that will be based off the articles that user has added to the Favourites.' },
                    { key: 'Search bar for finding any articles that you want' },
                    { key: 'Abillity to explore articles within a chosen category' }
                ]}
                renderItem={({ item }) => {
                    return (
                        <View style={{ marginBottom: 10 }}>
                            <Text style={{ fontSize: 20, color: 'white' }}>{`\u2022 ${item.key}`}</Text>
                        </View>
                    );
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black'
    }
});

export default InformationScreen;
