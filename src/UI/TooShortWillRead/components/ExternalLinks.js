import React from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

const ExternalLinks = (props) => {
    const sectionsToDisplay = [];

    if(props.googleUrl !== null && props.googleUrl !== undefined){
        sectionsToDisplay.push({title: 'Open on the Google page', link: props.googleUrl, icon: 'google'});
    }

    if(props.originalUrl !== null && props.originalUrl !== undefined){
        sectionsToDisplay.push({title: 'Original article link', link: props.originalUrl, icon: 'external-link'});
    }

    const renderList = sectionsToDisplay.map((item) => {
        return (
            <View style={styles.sectionContainer} key={item.title}>
                <View style={{justifyContent: 'center'}}>
                    <Icon name="circle" color='#FFFFFF' size={12} />
                </View>
                <View style={{paddingLeft: 5}}>
                    <Text style={styles.text} onPress={() => openLink(item.link)}>{item.title}</Text>
                </View>
                <View style={{justifyContent: 'center', paddingLeft: 5}}>
                    <Icon name={item.icon} color='#FFFFFF' size={18} />
                </View>
            </View>
        )
    });

    const openLink = (uri) => {
        props.navigation.navigate('Browser', {
            uri: uri
        });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>External Links</Text>
            {renderList}
        </View>

    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
    },
    sectionContainer: {
        flexDirection: 'row',
        paddingLeft: 10,
        alignContent: 'center',
        marginBottom: 7
    },
    headerText: {
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontSize: 24,
        marginBottom: 5
    },
    text: {
        color: '#379cdb',
        fontSize: 18,
        textDecorationLine: 'underline'
    }
})

export default ExternalLinks;

