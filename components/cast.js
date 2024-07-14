import React from "react";
import { Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import { image185 } from "../api/moviedb";

export default function Cast({ cast, navigation }) {
  return (
    <View style={{ marginTop: 6, marginBottom: 6 }}>
      <Text
        style={{ color: "white", marginLeft: 4, marginRight: 5, fontSize: 16 }}
      >
        Top Cast{" "}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {cast &&
          cast.map((person, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={{
                  marginRight: 4,
                  alignItems: "center",
                  padding: 7,
                }}
                onPress={() => navigation.navigate("Person", person)}
              >
                <View
                  style={{
                    overflow: "hidden",
                    borderRadius: 100,
                    height: 100,
                    width: 100,
                    borderWidth: 2,
                    borderBlockColor: "gray",
                  }}
                >
                  <Image
                    style={{ borderRadius: 10, height: 120, width: 100 }}
                    // source={require("../assets/castImage.png")}
                    source={
                      { uri: image185(person?.profile_path) } ||
                      fallbackPersonImage
                    }
                  />
                </View>
                <Text style={{ color: "white", fontSize: 14, marginTop: 5 }}>
                  {typeof person?.character === "string" &&
                  person?.character.length > 15
                    ? `${person?.character.slice(0, 15)}...`
                    : person?.character}
                </Text>
                <Text style={{ color: "gray", fontSize: 14, marginTop: 5 }}>
                  {typeof person?.original_name === "string" &&
                  person?.original_name.length > 15
                    ? `${person?.original_name.slice(0, 15)}...`
                    : person?.original_name}
                </Text>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
}
