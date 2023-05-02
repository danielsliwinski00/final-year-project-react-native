import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import styles from './screens/assets/stylesheet.js';
import Menu from './screens/menu.js'
import Checkout from './screens/checkout.js'
import Success from './screens/success.js'
import Toast from "react-native-toast-notifications";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu">
        <Stack.Screen name="Menu" component={Menu}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Checkout" component={Checkout}
          options={{ headerTitle: "", 
          headerTransparent: true }}
        />
        <Stack.Screen name="Success" component={Success}
          options={{ headerTitle: "", 
          headerTransparent: true,
          headerLeft: null 
        }}
        />
      </Stack.Navigator>
      <Toast ref={(ref) => global['toast'] = ref} />
    </NavigationContainer>
  );
}