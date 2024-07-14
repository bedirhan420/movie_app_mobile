import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebase/authantication";
import { setDoc, doc } from "firebase/firestore"; // Import Firestore functions
import { FIREBASE_DB } from "../firebase/authantication"; // Import the Firestore instance

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Error", "Please enter both email and password.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const user = userCredential.user;
      console.log("User signed up:", user);

      // Save user data to Firestore
      await setDoc(doc(FIREBASE_DB, "users", user.uid), { email: user.email,img:"" });

      // Navigate to the SignIn page after successful signup
      navigation.navigate('SignIn');
    } catch (error) {
      console.error("Error signing up:", error.message);
      Alert.alert("Error", "Failed to sign up. Please try again.");
    }
  };

  const handleSignInPress = () => {
    // Navigate to the SignIn page
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SignUp</Text>
      <TextInput
        style={styles.input}
        placeholder="New Email"
        placeholderTextColor="#ccc"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <TouchableOpacity onPress={handleSignUp} style={styles.signUpButton}>
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignInPress}>
        <Text style={styles.signInText}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f1f1f",
    justifyContent: 'center',
    alignItems: 'center',
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
  signUpButton: {
    backgroundColor: "#007bff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 16,
  },
  signInText: {
    color: 'white',
    marginTop: 10,
    alignSelf: 'flex-end',
  },
});
