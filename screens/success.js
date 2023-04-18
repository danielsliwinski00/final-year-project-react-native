import React, { Component } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-web';

import styles from './assets/stylesheet.js';

export default class Success extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      orderData: [],
      table: 0,
    }
  }

  sendOrder() {
    return fetch("http://192.168.1.209:8080/api/sendorder.php",
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'orderData': this.state.orderData
        })
      })
      .then((response) => {
        console.log('success')
      })
      .catch((error) => {
        console.log(error);
      });
  }

  sendTable() {
    return fetch("http://192.168.1.209:8080/api/sendorder.php",
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'tableNumber': this.state.table
        })
      })
      .then((response) => {
        console.log('success')
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.setState({
      orderData: this.props.route.params.cart,
      table: this.props.route.params.tableNumber,
    }, () => { this.sendOrder(); })
  }

  render() {
    return (
      <View style={[styles.viewH]}>

        <Text style={[styles.text]}>Successfull Payment</Text>

      </View>
    );
  }
}
