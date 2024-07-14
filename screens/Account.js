import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Dimensions,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from 'expo-image-picker';
import Loading from "../components/loading";
import { checkLoggedInUser} from "./SignIn";
import { FIREBASE_DB ,changePassword} from "../firebase/authantication";
import { doc, updateDoc } from "firebase/firestore";
import { theme, styles } from "../theme";

const { width, height } = Dimensions.get("window");

export default function Account() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await checkLoggedInUser();
        setUser(userData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const updateProfilePhoto = async () => {
    try {
      const userDocRef = doc(FIREBASE_DB, "users", user.uid);
      await updateDoc(userDocRef, { img:profilePhoto  });
      return "Profile photo updated successfully";
    } catch (error) {
      throw error.message;
    }
  };

  const handleChangePassword = async () => {
    try {
      await changePassword(newPassword);
      Alert.alert("Success", "Password changed successfully");
      setNewPassword(""); // Clear password input after changing
    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert("Error", "Failed to change password");
    }
  };

  const handleChooseProfilePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      await updateProfilePhoto();
      Alert.alert("Success", "Profile photo updated successfully");
      setProfilePhoto(result.uri);
      user.photoURL=result.uri
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#1f1f1f" }}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
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
      </SafeAreaView>

      {loading ? (
        <Loading />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            elevation: 100,
            shadowColor: "gray",
          }}
        >
          <TouchableOpacity onPress={handleChooseProfilePhoto}>
            {user.photoURL? (
              <Image
                source={{ uri:user.photoURL }}
                style={{
                  marginTop:100,
                  width: 200,
                  height: 200,
                  borderRadius: 100,
                  borderWidth: 2,
                  borderColor: "gray",
                }}
              />
            ) : (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 100,
                  overflow: "hidden",
                  height: 200,
                  width: 200,
                  borderWidth: 2,
                  borderColor: "gray",
                }}
              >
                <Icon name="user" size={150} color="gray" />
              </View>
            )}
          </TouchableOpacity>
          <View style={{ marginTop: 50,marginBottom:50 }}>
            <Text style={{ fontSize: 24, color: "white", textAlign: "center" }}>
              {user.email}
            </Text>
          </View>
          <View style={{ marginTop: 20 }}>
            <TextInput
              placeholder="New Password"
              style={{
                backgroundColor: "white",
                width: width * 0.8,
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 10,
              }}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity
              onPress={handleChangePassword}
              style={{
                backgroundColor: "blue",
                width: width * 0.8,
                marginTop: 10,
                paddingVertical: 10,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white" }}>Change Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
