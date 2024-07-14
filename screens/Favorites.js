import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { checkLoggedInUser } from "./SignIn";
import { getDoc, doc } from "firebase/firestore";
import { FIREBASE_DB } from "../firebase/authantication";
import {
  fallbackMoviePoster,
  fetchMovieCredits,
  fetchMovieDetails,
  fetchSimilarMovies,
  image500,
  image185
} from "../api/moviedb";
import Loading from "../components/loading";
import { useNavigation } from "@react-navigation/native";
import { theme, styles } from "../theme";


const { width, height } = Dimensions.get("window");

export default function Favorites() {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMovie, setIsMovie] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const user = await checkLoggedInUser();
        const userDocRef = doc(FIREBASE_DB, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const favoritesData = userDoc.data().favorites || [];

          if (isMovie) {
            const movieFavorites = favoritesData.filter(
              (item) => item.type === "movie"
            );
            setFavorites(movieFavorites);
          } else {
            const personFavorites = favoritesData.filter(
              (item) => item.type === "person"
            );
            setFavorites(personFavorites);
          }
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [isMovie]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1f1f1f" }}>
      <View
        style={{
          padding: 5,
          marginTop: 20,
          marginLeft: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
         <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.background, { borderRadius: 15, padding: 10 }]}
        >
          <Icon name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsMovie(true)}
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 15,
            marginRight: 10,
            marginLeft:50,
            backgroundColor: isMovie ? "#333" : null,
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            Movies
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsMovie(false)}
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 15,
            backgroundColor: !isMovie ? "#333" : null,
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            Persons
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Loading />
      ) : favorites.length > 0 ? (
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
            Favorites ({favorites.length})
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
          {favorites.map((item, index) => (
            <View key={index} style={{ margin: 10 }}>
            <TouchableWithoutFeedback
              onPress={() => {
                if (isMovie) {
                  navigation.push("Movie", item); // Push to Movie screen
                } else {
                  navigation.push("Person", item); // Push to Person screen
                }
              }}
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
                    uri: image185(item?.img) || fallbackMoviePoster,
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
