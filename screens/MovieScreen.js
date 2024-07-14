import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  TouchableOpacity,
  ImageBackground,
  Text,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import { theme, styles } from "../theme";
import { Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Cast from "../components/cast";
import MovieList from "../components/movieList";
import Loading from "../components/loading";
import {
  fallbackMoviePoster,
  fetchMovieCredits,
  fetchMovieDetails,
  fetchSimilarMovies,
  image500,
} from "../api/moviedb";
import { checkLoggedInUser } from "./SignIn";
import { addDoc, collection, getDoc, doc,setDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../firebase/authantication";
import {addToFavorites,removeFromFavorites} from "../firebase/database"

const { width, height } = Dimensions.get("window");

export default function MovieScreen() {
  const { params: item } = useRoute();
  const [isFavourite, toggleFavourite] = useState(false);
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    setLoading(true);
    getMovieDetails(item.id);
    getMovieCredits(item.id);
    getSimilarMovies(item.id);
    checkLoggedInUser()
      .then((user) => {
        if (user) {
          console.log("User is logged in:", user.email);
          checkIfFavorite(user.uid, item.id);
        } else {
          console.log("No user is logged in.");
        }
      })
      .catch((error) => {
        console.error("Error checking user authentication:", error);
      });
  }, [item]);

  const checkIfFavorite = async (userId, movieId) => {
    try {
      const userDocRef = doc(FIREBASE_DB, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const favorites = userDoc.data().favorites || [];
        const isFavorite = favorites.some(favorite => favorite.id === movieId);
        toggleFavourite(isFavorite);
      } else {
        console.error("Kullanıcı bulunamadı.");
      }
    } catch (error) {
      console.error("Hata oluştu:", error);
    }
  };

  const getMovieDetails = async (id) => {
    const data = await fetchMovieDetails(id);
    if (data) setMovie(data);
    setLoading(false);
  };

  const getMovieCredits = async (id) => {
    const data = await fetchMovieCredits(id);
    if (data && data.cast) setCast(data.cast);
    setLoading(false);
  };

  const getSimilarMovies = async (id) => {
    const data = await fetchSimilarMovies(id);
    if (data && data.results) setSimilarMovies(data.results);
    setLoading(false);
  };

  const handleToggleFavorites = async () => {
    try {
      const user = await checkLoggedInUser();
      img=movie?.poster_path || fallbackMoviePoster
      if (user) {
        if (isFavourite) {
          await removeFromFavorites(user.uid, movie.id);
          toggleFavourite(false);
        } else {
          await addToFavorites(user.uid, movie.id,"movie",img,movie.title);
          toggleFavourite(true);
        }
      } else {
        console.log("Kullanıcı giriş yapmamış.");
      }
    } catch (error) {
      console.error("Favorilere ekleme/silme işleminde hata oluştu:", error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 20 }}
      style={[styles.background, { flex: 1, backgroundColor: "#1f1f1f" }]}
    >
      <ImageBackground
        source={{ uri: image500(movie?.poster_path) || fallbackMoviePoster }}
        style={{ width, height: height * 0.55 }}
      >
        <View style={{ width: "100%" }}>
          <SafeAreaView
            style={{
              marginTop: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[styles.background, { borderRadius: 15, padding: 10 }]}
            >
              <Icon name="chevron-left" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleToggleFavorites}>
              <Icon
                name="heart"
                size={30}
                color={isFavourite ? theme.background : "white"}
              />
            </TouchableOpacity>
          </SafeAreaView>
        </View>
        <LinearGradient
          colors={["transparent", "rgba(23,23,23,0.8)", "rgba(23,23,23,1)"]}
          style={{
            width,
            height: height * 0.1,
            position: "absolute",
            bottom: 0,
          }}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        ></LinearGradient>
      </ImageBackground>
      <View style={{ marginTop: -(height * 0.04) }}>
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontSize: 24,
            fontWeight: "bold",
          }}
        >
          {movie?.title}
        </Text>
        {movie?.id ? (
          <Text
            style={{
              color: "gray",
              fontWeight: "semibold",
              fontSize: 17,
              textAlign: "center",
              marginTop: 10,
            }}
          >
            {movie?.status} . {movie?.release_date?.split("-")[0]} .{" "}
            {movie?.runtime} min
          </Text>
        ) : null}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            margin: "0.4rem",
            marginTop: 10,
          }}
        >
          {movie?.genres?.map((genre, index) => {
            let showDot = index + 1 != movie.genres.length;
            return (
              <Text
                key={index}
                style={{
                  color: "gray",
                  fontWeight: "semibold",
                  fontSize: 15,
                  textAlign: "center",
                }}
              >
                {genre?.name} {showDot ? "." : ""}
              </Text>
            );
          })}
        </View>
        <Text
          style={{
            color: "gray",
            textAlign: "center",
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          {movie?.overview}
        </Text>
      </View>
      <Cast navigation={navigation} cast={cast}></Cast>
      <MovieList
        title="Similar Movies"
        hideSeeAll={true}
        data={similarMovies}
      ></MovieList>
    </ScrollView>
  );
}
