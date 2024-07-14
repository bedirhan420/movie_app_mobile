//home.js
import React, { useState, useEffect } from "react";
import { View, StatusBar, TouchableOpacity, Text, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import SidebarMenu from "../components/sidebarMenu"; // Import the SidebarMenu component
import TrendingMovies from "../components/trendingMovies";
import MovieList from "../components/movieList";
import { useNavigation } from "@react-navigation/native";
import { fetchTrendingMovies, fetchUpcomingMovies, fetchTopRatedMovies } from "../api/moviedb";

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    getTrendingMovies();
    getUpcomingMovies();
    getTopRatedMovies();
  }, []);

  const getTrendingMovies = async () => {
    const data = await fetchTrendingMovies();
    if (data && data.results) setTrending(data.results);
    setLoading(false);
  };

  const getUpcomingMovies = async () => {
    const data = await fetchUpcomingMovies();
    if (data && data.results) setUpcoming(data.results);
  };

  const getTopRatedMovies = async () => {
    const data = await fetchTopRatedMovies();
    if (data && data.results) setTopRated(data.results);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#1f1f1f" }}>
      <StatusBar barStyle="light-content" backgroundColor="#2f2f2f" />
      <View style={localStyles.header}>
        <TouchableOpacity onPress={toggleSidebar}>
          <Icon name="bars" size={30} color="white" />
        </TouchableOpacity>
        <Text style={localStyles.moviesText}>
          <Text style={{ color: "orange", fontWeight: "bold", fontSize: 30 }}>M</Text>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 24 }}>ovies</Text>
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <Icon name="search" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, flexDirection: "row" }}>
        {
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
            {/* {trending films carousel} */}
            {trending.length > 0 && <TrendingMovies data={trending} />}
            {/* {upcoming movies row} */}
            <MovieList title="Upcoming" data={upcoming} />
            {/* {top rated movies row} */}
            <MovieList title="Top Rated" data={topRated} />
          </ScrollView>
        }
      </View>
      {showSidebar && <SidebarMenu />}
    </View>
  );
}

const localStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  moviesText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
