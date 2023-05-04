import React, { Component } from 'react';
import { FlatList, ActivityIndicator, Text, View, Button, StyleSheet, Box, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './assets/stylesheet.js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

export default class Success extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      orderData: [],
      table: 0,
      orderid: 0,
      totalCost: 0,
    }
  }

  sendOrder() {
    return fetch("http://13.53.140.87/sendorder.php",
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'orderData': this.state.orderData
        })
      })
      .then((response) => {
        return response.json()
      })
      .then((responseJson) => {
        this.setState({
          orderid: responseJson,
          isLoading: false
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  addTableNumber() {
    console.log(this.state.orderData)
    var orderTable = this.state.orderData
    for (let i = 0; i < orderTable.length; i++) {
      orderTable[i].table = Number(this.state.table)
    }

    this.setState({
      orderData: orderTable
    }, () => { this.sendOrder(); })
  }

  componentDidMount() {
    this.setState({
      orderData: this.props.route.params.cart,
      table: this.props.route.params.tableNumber,
      customerName: this.props.route.params.customerName,
      totalCost: this.props.route.params.orderCost,
    }, () => { this.addTableNumber(); })
  }

  render() {
    if (this.state.isLoading == true) {
      return (
        <View style={[{ marginTop: '50%' }]}>
          <ActivityIndicator />
        </View>
      )
    }
    return (
      <View style={[styles.view, { flex: 1 }]}>
        <View style={[{ flex: 1, }]}>
          <Text style={[styles.text, { alignSelf: 'center' }]}>Successfull Payment</Text>
        </View>
        <View style={[{ flex: 1, }]}>
          <Text style={[styles.text, { alignSelf: 'center', fontSize: 22 }]}>Thank you for your order {this.state.customerName}</Text>
        </View>
        <View style={[{ flex: 1, }]}>
          <Text style={[styles.text, { alignSelf: 'center', fontSize: 20 }]}>Your order number is: {this.state.orderid.orderid} (table: {this.state.table})</Text>
        </View>
        <View style={[{ flex: 6, marginBottom:10 }]}>
          <Text style={[styles.text, { marginBottom: -5, alignSelf: 'center', fontSize: 18, height: '10%' }]}>Your order:</Text>
          <View style={[{ flex: 1, }]}>
            <FlatList
              style={[{ alignSelf: 'center', width: '80%', height: '70%' }]}
              data={this.state.orderData}
              keyExtractor={item => item.itemid}
              renderItem={({ item }) => {
                return (
                  <View style={{ flex: 1, flexDirection: 'column' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <View style={{ flex: 8, height: 60 }}>
                        <Text style={[styles.menuText, { fontSize: 18 }]}>{item.dish}
                        </Text>
                      </View>
                      <View style={{ flex: 2, height: 60 }}>
                        <Text style={[styles.menuText, { fontSize: 18 }]}>x{item.amount}
                        </Text>
                      </View>
                    </View>
                    <View style={[{ flex: 1, height: 60, marginTop:-20 }]}>
                      <Text style={[styles.menuText, { fontSize: 16 }]}>£{item.price/100}
                      </Text>
                    </View>
                  </View>)
              }}
            />
          </View>
          <Text style={[styles.text, { marginBottom: -5, alignSelf: 'center', fontSize: 18, height: '10%' }]}>SubTotal: £{this.state.totalCost/100}</Text>
        </View>
      </View>
    );
  }
}
