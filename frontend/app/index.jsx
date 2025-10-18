import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
  
    <Image source={require('../assets/images/mascot.png-removebg-preview.png')} style={styles.mascot} />

      <Text style={styles.title}>✨ Speech Spark ✨</Text>

      <Text style={styles.subtitle}>
        Let’s have fun practicing your words together! 🗣️💬
      </Text>

      <Link href="/agentSelect" style={[styles.button, styles.primaryButton]}>
        🔥 Pick an Agent!!
      </Link>

      <Text style={styles.note}>You’re doing amazing! 🌟</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 30,
    backgroundColor: '#FFF9E6', // warm friendly tone
  },

mascot: {
  width: 300,
  height: 300,
  resizeMode: 'contain',
},

  title: { 
    fontSize: 36, 
    fontWeight: '900', 
    color: '#FF7A00',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  subtitle: { 
    fontSize: 20, 
    color: '#444', 
    textAlign: 'center', 
    marginBottom: 50,
  },
  
  button: {
    textAlign: 'center',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 15,
    overflow: 'hidden',
    fontSize: 18,
    fontWeight: 'bold',
  },

  primaryButton: {
    backgroundColor: '#FFB703',
    color: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },

  note: {
    marginTop: 30,
    fontSize: 16,
    color: '#FF7A00',
    fontStyle: 'italic',
  },
});
