import React, { useEffect, useRef, useState } from "react";
import { View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { loadFavouriteArticle } from "../redux/actions/loadFavouriteArticle";
import Icon from "react-native-vector-icons/Ionicons";
import { removeFavouriteArticle, addFavouriteArticle} from "../redux/actions/favouritesArticlesActions";

const Header = ({ onPress, favouriteButtonIcon }) => {
    return (
        <View>
            <View style={{
                flexDirection: 'row',
                textAlign: 'center',
                justifyContent: 'space-between',
                paddingVertical: 8,
                paddingHorizontal: 10,
                marginTop: 10,
                marginBottom: 10
            }}>
                <Icon name={favouriteButtonIcon} color='dodgerblue' size={30} onPress={onPress} />
            </View>
        </View>
    )
}

export default function FavouriteArticleScreen({ route, navigation }) {
    const dispatch = useDispatch();
    const { articleId } = route.params;

    useEffect(() => dispatch(loadFavouriteArticle(articleId)), []);
    const currentArticle = useSelector(state => state.favouriteArticlesReducer.currentFavouriteArticle);
    const { isLoading, article } = currentArticle;

    // Favourite article config
    const getFavouriteIcon = () => {
        return isFavourite ? 'star' : 'star-outline';
    }
    const isFavourite = useSelector(state =>
        state.favouriteArticlesReducer.favouriteArticles.find(a => a.id === article.id) !== undefined);
    const [favouriteButtonIcon, setFavouriteButtonIcon] = useState(getFavouriteIcon());
    useEffect(() => {
        const favIcon = getFavouriteIcon();
        setFavouriteButtonIcon(favIcon);
    }, [isFavourite]);


    const toggleFavouriteButton = () => {
        if (isFavourite) {
            dispatch(removeFavouriteArticle(article.id));
        }
        else {
            const articleToAdd = {
                id: article.id,
                header: article.header,
                imageUrl: article.imageUrl,
                categories: article.categories
            };
            dispatch(addFavouriteArticle(articleToAdd));
        }
    }

    return (
        <View>
            <Header onPress={toggleFavouriteButton} favouriteButtonIcon={favouriteButtonIcon} />
            <Text>AAAA</Text>
            <Text>Current Article: {article.header}</Text>
            <Text>Is Loading: {isLoading.toString()}</Text>
            <Text>Is Favourite: {isFavourite.toString()}</Text>
        </View>
    )
}