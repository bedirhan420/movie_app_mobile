import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Dimensions, Text, TouchableWithoutFeedback, View,Image } from "react-native";
import Carousel from "react-native-snap-carousel";
import { image500 } from "../api/moviedb";

var { width, height } = Dimensions.get("window");

export default function TrendingMovies({data}) {

  const navigation = useNavigation();

  const handleClick=(item)=>{
    navigation.navigate("Movie",item)
  }

  return (
    <View style={{ marginBottom: 8 }}>
      <Text
        style={{ color: "white", fontSize: 20, marginLeft: 4, marginBottom: 5 }}
      >
        Trending
      </Text>
      <Carousel
        data={data}
        renderItem={({ item }) => <MovieCard item={item} handleClick={()=>handleClick(item)} />}
        firstItem={1}
        inactiveSlideOpacity={0.6}
        sliderWidth={width}
        itemWidth={width*.62}
        slideStyle={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    </View>
  );
}

const MovieCard = ({ item,handleClick }) => {
  return (
    <TouchableWithoutFeedback onPress={handleClick} >
      <Image
        // source={require("../assets/moviePoster1.png")}
        source={{uri:image500(item.poster_path)}}
        style={{ width: width * 0.6, height: height * 0.4, borderRadius: 20 }}
      />
    </TouchableWithoutFeedback>
  );
};
