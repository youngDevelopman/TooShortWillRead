import React, { useEffect, useRef, useState } from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";

export default function FavouriteArticleScreen() {
    const {article} = useSelector(state => state.readArticlesReducer.currentArticle);
    return (
        <View>
            <Text>AAAA</Text>
            <Text>{article.header}</Text>
        </View>
    )
}