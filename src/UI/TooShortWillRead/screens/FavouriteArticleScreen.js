import React, { useEffect, useRef, useState } from "react";
import { View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { loadFavouriteArticle } from "../redux/actions/loadFavouriteArticle";

export default function FavouriteArticleScreen({ route, navigation }) {
    const dispatch = useDispatch();
    const { articleId } = route.params;
    useEffect(() => dispatch(loadFavouriteArticle(articleId)), []);
    const { article, isLoading } = useSelector(state => state.favouriteArticlesReducer.currentFavouriteArticle);
    return (
        <View>
            <Text>AAAA</Text>
           <Text>Current Article: {article.header}</Text>
        </View>
    )
}