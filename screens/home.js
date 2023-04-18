import React, { Component } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-web';

import styles from './assets/stylesheet.js';

class Home extends Component{
  render(){
    return(
        <View style={[styles.viewHome]}>

          <Text style={[styles.text]}>Home Screen</Text>

          <TouchableOpacity style={[styles.box]}
            onPress={()=> this.props.navigation.navigate('Checkout')}>
            <Text style={[styles.text]}>Checkout</Text>
          </TouchableOpacity >

        </View>
    );
  }
}

export default Home;
