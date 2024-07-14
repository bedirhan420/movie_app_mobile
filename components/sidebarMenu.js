import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";

const windowHeight = Dimensions.get('window').height;

export default function SidebarMenu() { 

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuTextTitle}>Welcome</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={styles.menuItem}  >
        <Text style={styles.menuText} onPress={() => navigation.navigate("Account")} >Account</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuText} onPress={() => navigation.navigate("Favorites")}>Favorites</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuText} >Log Out</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '8%', 
    left: 0,
    backgroundColor: '#222',
    width: '60%', 
    height: windowHeight, 
    paddingBottom: 300, // adjusted padding top
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    marginBottom: 20,
  },
  menuTextTitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 80, // more margin than other items
    fontWeight: 'bold', // added bold font weight
  },
  loggedInUserText: {
    fontSize: 16,
    color: 'white',
  },
  menuText: {
    fontSize: 18,
    color: 'white',
  },
  separator: {
    height: 2, // thicker separator
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // adjusted color and opacity
    width: '80%',
    marginBottom: 20,
  },
});
