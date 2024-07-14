import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Loading from "../components/loading";
import { debounce } from "lodash";
import { fallbackMoviePoster, image185,searchMovies } from "../api/moviedb";


const { width, height } = Dimensions.get("window");

export default function SearchScreen() {
  const navigation = useNavigation();
  const [results, setResults] = useState([]);
  const movieName = "Ant-Man and the Wasp: Quantumania";
  const [loading, setLoading] = useState(false);
  const handleSearch = search=>{
    if(search && search.length>=2){
        setLoading(true);
        searchMovies({
            query: search,
            include_adult: false,
            language: 'en-US',
            page: '1'
        }).then(data=>{
            console.log('got search results');
            setLoading(false);
            if(data && data.results) setResults(data.results);
        })
    }else{
        setLoading(false);
        setResults([])
    }
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#1f1f1f" }}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View
        style={{
          marginLeft: 4,
          marginRight: 4,
          marginBottom: 3,
          borderWidth: 2,
          borderColor: "gray",
          borderRadius: 100,
          padding: 5,
          marginTop: 20,
          flexDirection: "row",
        }}
      >
        <TextInput
         onChangeText={(text) => handleTextDebounce(text)}
          placeholder="Search Movie"
          placeholderTextColor={"lightgray"}
          style={{
            flex: 1,
            paddingBottom: 1,
            paddingLeft: 6,
            fontSize: 14,
            color: "white",
          }}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={{
            borderRadius: 100,
            padding: 3,
            margin: 1,
            backgroundColor: "gray",
          }}
        >
          <Icon name="close" size={30} color="white" />
        </TouchableOpacity>
      </View>
      {/* results */}
      {loading ? (
        <Loading></Loading>
      ) : results.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15 }}
        >
          <Text
            style={{
              color: "white",
              marginLeft: 3,
              marginTop: 30,
              marginBottom: 30,
            }}
          >
            Results ({results.length}){" "}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            {results.map((item, index) => (
              <View key={index} style={{ margin: 10 }}>
                <TouchableWithoutFeedback
                  onPress={() => navigation.push("Movie", item)}
                >
                  <View>
                    <Image
                      style={{
                        borderRadius: 25,
                        width: width * 0.4,
                        height: height * 0.3,
                      }}
                      // source={require("../assets/moviePoster2.png")}
                      source={{
                        uri: image185(item?.poster_path) || fallbackMoviePoster,
                      }}
                    />
                    <Text
                      style={{ color: "gray", marginLeft: 1, marginTop: 10 }}
                    >
                      {typeof item?.title === "string" && item?.title.length > 15
                        ? `${item?.title.slice(0, 15)}...`
                        : item?.title}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 150,
          }}
        >
          <Image
            source={require("../assets/watchingMovie.png")}
            style={{ height: 250, width: 250 }}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
