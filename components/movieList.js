import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
  Dimensions,
} from "react-native";
import { styles } from "../theme/index";
import { useNavigation } from "@react-navigation/native";
import { fallbackMoviePoster, image185 } from "../api/moviedb";

var { width, height } = Dimensions.get("window");

export default function MovieList({ title, data, hideSeeAll }) {
  let movieName = "Ant-Man and the Wasp: Quantumania";
  const navigation = useNavigation();

  return (
    <View style={{ marginBottom: 8, paddingVertical: 16 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginHorizontal: 4,
        }}
      >
        <Text style={{ color: "white", fontSize: 18 }}> {title} </Text>
        {!hideSeeAll && (
          <TouchableOpacity>
          </TouchableOpacity>
        )}
      </View>
      {/* {movie row} */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {data.map((item, index) => (
          <TouchableWithoutFeedback
            key={index}
            onPress={() => navigation.push("Movie", item)}
          >
            {/* Wrap your content inside a single parent element */}
            <View style={{ margin: 20, paddingVertical: 1 }}>
              <Image
                // source={require("../assets/moviePoster2.png")}
                source={{ uri: image185(item.poster_path) || fallbackMoviePoster }}
                style={{
                  borderRadius: 20,
                  width: width * 0.33,
                  height: height * 0.22,
                }}
              />
              <Text
                style={{
                  marginTop: 10,
                  marginLeft: 1,
                  color: "white",
                  textAlign: "center",
                }}
              >
                {typeof item.title === "string" && item.title.length > 15
                  ? `${item.title.slice(0, 15)}...`
                  : item.title}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
    </View>
  );
}
