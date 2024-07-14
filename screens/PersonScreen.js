import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Dimensions,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { theme, styles } from "../theme";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";
import MovieList from "../components/movieList"
import Loading from "../components/loading";
import { fallbackPersonImage, fetchPersonDetails, fetchPersonMovies, image342 } from "../api/moviedb";
import { checkLoggedInUser } from "./SignIn";
import { getDoc, doc } from "firebase/firestore";
import { FIREBASE_DB } from "../firebase/authantication";
import { addToFavorites, removeFromFavorites } from "../firebase/database";

const { width, height } = Dimensions.get("window");

export default function PersonScreen() {
  const { params: item } = useRoute();
  const [isFavourite, setIsFavorite] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [personMovies, setPersonMovies] = useState([]);
  const [person, setPerson] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPersonDetails(item.id);
    getPersonMovies(item.id);
    console.log(isFavourite)
  }, [item]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const user = await checkLoggedInUser();
        if (user) {
          const docRef = doc(FIREBASE_DB, "users", user.uid);
          console.log(docRef)
          const docSnap = await getDoc(docRef);
          const userData = docSnap.data();
          console.log(userData)
          console.log(item.id)
          console.log(userData.favorites)
          if (
            userData &&
            userData.favorites &&
            userData.favorites.some(favorite => favorite.id === item.id)
          ) {
            console.log("aaaaaaaaa");
            setIsFavorite(true);
          } else {
            console.log("bbbbbbbbb");
            setIsFavorite(false);
          }
          
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };
  
    fetchFavorites();
    console.log(isFavourite)
  }, []);
  

  const getPersonDetails = async (id) => {
    const data = await fetchPersonDetails(id);
    if (data) setPerson(data);
    setLoading(false);
  };

  const getPersonMovies = async (id) => {
    const data = await fetchPersonMovies(id);
    if (data && data.cast) setPersonMovies(data.cast);
    setLoading(false);
  };
  const handleToggleFavorites = async () => {
    try {
      const user = await checkLoggedInUser();
      img =person?.profile_path || fallbackPersonImage  
      if (user) {
        if (isFavourite) {
          await removeFromFavorites(user.uid, item.id);
        } else {
          await addToFavorites(user.uid, item.id, "person",img,person.name);
        }
        setIsFavorite(!isFavourite);
      } else {
        console.log("Kullanıcı giriş yapmamış.");
      }
    } catch (error) {
      console.error("Favorilere ekleme/silme işleminde hata oluştu:", error);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#1f1f1f" }}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      {/* back button heart */}
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
          <Icon name="heart" size={30} color={isFavourite ? "red" : "white"} />
        </TouchableOpacity>
      </SafeAreaView>

      {/* person details */}
      {
        loading ? <Loading /> : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              elevation: 100,
              shadowColor: "gray",
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 150,
                overflow: "hidden",
                height: 300,
                width: 300,
                borderWidth: 2,
                borderColor: "gray",
              }}
            >
              <Image
                source={{ uri: image342(person?.profile_path) || fallbackPersonImage }}
                style={{
                  height: height * 0.4,
                  width: width * 0.75,
                  marginTop: 20,
                }}
              />
            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 24, color: "white", textAlign: "center" }}>
                {person?.name}
              </Text>
              <Text style={{ fontSize: 18, color: "gray", textAlign: "center" }}>
                {person?.place_of_birth}
              </Text>
            </View>
            <View
              style={{
                marginLeft: 10,
                marginRight: 10,
                marginTop: 50,
                height: 100,
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: "#353735",
                borderRadius: 100,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRightWidth: 2,
                  borderColor: "white",
                  paddingVertical: 10,
                  padding: 3,
                }}
              >
                <Text style={{ color: "white", fontSize: 18, marginBottom: 10 }}>Gender</Text>
                <Text style={{ color: "gray", fontSize: 16 }}> {person?.gender == 1 ? "Female" : "Male"} </Text>
              </View>

              <View style={{ width: 2, backgroundColor: "gray" }} />

              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRightWidth: 2,
                  borderColor: "white",
                  paddingVertical: 10,
                  padding: 3,
                }}
              >
                <Text style={{ color: "white", fontSize: 18, marginBottom: 10 }}>Birthday</Text>
                <Text style={{ color: "gray", fontSize: 16 }}> {person?.birthday} </Text>
              </View>

              <View style={{ width: 2, backgroundColor: "gray" }} />

              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRightWidth: 2,
                  borderRightHeight: 2,
                  borderColor: "white",
                  paddingVertical: 10,
                  padding: 3,
                }}
              >
                <Text style={{ color: "white", fontSize: 18, marginBottom: 10 }}>Known for</Text>
                <Text style={{ color: "gray", fontSize: 16 }}> {person?.known_for_department} </Text>
              </View>

              <View style={{ width: 2, backgroundColor: "gray" }} />

              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: "white",
                  paddingVertical: 10,
                  padding: 3,
                }}
              >
                <Text style={{ color: "white", fontSize: 18, marginBottom: 10 }}>Popularity</Text>
                <Text style={{ color: "gray", fontSize: 16 }}> {person?.popularity?.toFixed(2)} % </Text>
              </View>

              <View style={{ width: 2, backgroundColor: "gray" }} />
            </View>
            <View style={{ marginTop: 50 }}>
              <Text style={{ color: "white", fontSize: 18, marginBottom: 20, marginLeft: 15, marginRight: 15 }}>Biography</Text>
              <Text style={{ color: "gray", fontSize: 16, marginBottom: 20, marginLeft: 15, marginRight: 15 }}>
                {person?.biography || "N/A"}.
              </Text>
            </View>

          </View>
        )
      }
      <MovieList title={"Movies"} hideSeeAll={true} data={personMovies} ></MovieList>

    </ScrollView>
  );
}
