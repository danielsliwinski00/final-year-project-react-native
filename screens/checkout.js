import React, { Component } from 'react';
import { FlatList, ActivityIndicator, Text, View, Button, StyleSheet, Box, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './assets/stylesheet.js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

export default class Checkout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            checkoutCart: [],
            amount: 0,
            currency: "GBP",
            table: 0,
        }
    }

    cartCost() {
        var totalCost = 0
        for (var i = 0; i < this.state.checkoutCart.length; i++) {
            var obj = this.state.checkoutCart[i];
            //let quantity = obj.amount;
            let itemCost = obj.price;
            //let itemCostTotal = quantity * itemCost;
            totalCost = totalCost += itemCost;
        }

        this.setState({
            amount: totalCost,
            isLoading: false,
        })

    }

    successfulPayment() {
        this.props.navigation.replace('Successs')
    }

    componentDidMount() {
        this.setState({
            checkoutCart: this.props.route.params.cart,
            tableNum: this.props.route.params.tableNumber,
        }, () => { this.cartCost() })

    }

    componentWillUnmount() {
        this.setState({
            checkoutCart: [],
            amount: 0,
        })

    }

    render() {
        if (this.state.isLoading == true) {
            return (
                <View style={[styles.view]}>
                    <ActivityIndicator />
                </View>
            )
        }
        else {
            console.log('render return');
            return (
                <View style={[styles.view]}>

                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={[styles.text, { flex: 1, height: '100%', alignSelf: 'center' }]}>Checkout</Text>
                        <Text style={[styles.text, { flex: 1, height: '80%', top: '10%', alignSelf: 'center', fontSize: 18 }]}>SubTotal: £{Number(this.state.amount/100)}</Text>
                    </View>
                    <View style={{ flex: 6 }}>
                        <FlatList
                            data={this.state.checkoutCart}
                            keyExtractor={item => item.itemid}
                            renderItem={({ item }) => {
                                return (
                                    <View style={{ flex: 1, flexDirection: 'column' }}>
                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                            <View style={{ flex: 8, height: 60 }}>
                                                <Text style={[styles.menuText, { fontSize: 18 }]}>{item.dish} - £{item.price / 100}
                                                </Text>
                                            </View>
                                            <View style={{ flex: 2, height: 60 }}>
                                                <Text style={[styles.menuText, { fontSize: 18 }]}>x{item.amount}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>)
                            }}
                        />
                    </View>
                    <View style={{ flex: 2 }}>

                        <Button onPress={()=>{this.props.navigation.navigate('Success', { cart: this.state.checkoutCart, tableNumber: this.state.table })}}>press</Button>

                        <PayPalScriptProvider options={{
                            'client-id': 'AYm5zyL0uROMHbj3XptgNfeBZUiALgxgmDMwBQcEQBxK4r7gYq-p1hDe_v-uWfxu7EThI7qr5KsMC6xA',
                            'currency': this.state.currency
                        }}>
                            <PayPalButtons
                                createOrder={(data, actions) => {
                                    return actions.order
                                        .create({
                                            purchase_units: [
                                                {
                                                    amount: {
                                                        value: this.state.amount/100,
                                                    },
                                                },
                                            ],
                                        })
                                        .then((orderId) => {
                                            // Your code here after create the order
                                            return orderId;
                                        });
                                }}
                                onApprove={(data, actions) => {
                                    return actions.order.capture().then((details) => {
                                        console.log(details.payer.name.given_name)
                                        this.props.navigation.navigate('Success', { cart: this.state.checkoutCart, tableNumber: this.state.table })
                                    });
                                }}
                                onCancel={function (data, actions) {
                                    return actions.order.capture().then(() => {
                                        // Your code here after capture the order
                                        console.log('canceled')
                                        this.props.navigation.navigate('Menu')
                                    });
                                }}
                            />
                        </PayPalScriptProvider>
                    </View>
                </View>
            );
        }
    }
}



/*
<PayPalScriptProvider options={{
                            'client-id': 'AYm5zyL0uROMHbj3XptgNfeBZUiALgxgmDMwBQcEQBxK4r7gYq-p1hDe_v-uWfxu7EThI7qr5KsMC6xA',
                            'components': 'buttons',
                            'currency': "GBP"
                        }}>
                            <PayPalButtons style={{ layout: 'horizontal' }}
                                createOrder={(data, actions) => {
                                    return actions.order
                                        .create({
                                            purchase_units: [
                                                {
                                                    amount: {
                                                        currency_code: this.state.currency,
                                                        value: this.state.amount,
                                                    },
                                                },
                                            ],
                                        })
                                        .then((orderId) => {
                                            // Your code here after create the order
                                            return orderId;
                                        });
                                }}
                                onApprove={function (data, actions) {
                                    return actions.order.capture().then(
                                        console.log('success')
                                        //this.successfulPayment()
                                    );
                                }}
                                onCancel={function (data, actions) {
                                    return actions.order.capture().then(function () {
                                        // Your code here after capture the order
                                        console.log('canceled')
                                    });
                                }}
                            />
                        </PayPalScriptProvider>
*/