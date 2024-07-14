//signin.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { signInWithEmailAndPassword ,FIREBASE_AUTH} from "../firebase/authantication";

export const checkLoggedInUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged(user => {
      unsubscribe(); 
      resolve(user); 
    }, reject);
  });
};

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null); // State to hold logged-in user's email

  const handleSignIn = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Error", "Please enter both email and password.");
        return;
      }
  
      console.log("Attempting to sign in with email:", email, "and password:", password);
  
      const userCredential = await signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      console.log("User signed in:", user);
      setLoggedInUser(user.email); // Set logged-in user's email
      navigation.navigate('Home');
    } catch (error) {
      console.error("Error signing in:", error.code, error.message);
      Alert.alert("Error", "Invalid email or password. Please try again.");
    }
  };

  const handleSignUpPress = () => {
    // Navigate to the SignUp page
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <TouchableOpacity onPress={handleSignIn} style={styles.signInButton}>
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignUpPress}>
        <Text style={styles.signUpText}>New user? Sign Up</Text>
      </TouchableOpacity>
      {/* Pass loggedInUser as prop to SidebarMenu */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f1f1f",
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    padding: 5,
    width: 200,
    color: 'white',
    borderRadius: 10,
  },
  signInButton: {
    backgroundColor: "#007bff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  signInButtonText: {
    color: 'white',
    fontSize: 16,
  },
  signUpText: {
    color: 'white',
    marginTop: 10,
  },
});
