import React, { Component } from 'react';
import { FlatList, ActivityIndicator, Text, View, Button, StyleSheet, Box, Image, ScrollView, SectionList, Modal } from 'react-native';
import { TouchableOpacity, TouchableHighlight } from 'react-native-web';
import styles from './assets/stylesheet.js';

export default class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            menuData: [],
            cartItems: [],
            table: 0,
            counterUpdate: 0,
            food: [],
            drinks: [],
            desserts: [],
            allMenuData: [],
            cartModal: false,
            emptyCartModal: false,
        }
    }

    getMenu() {
        return fetch("http://13.53.140.87/menu.php",
            {
                headers: { 'Content-Type': 'application/json' }
            })
            .then((response) => {
                return response.json();
            })
            .then((responseJson) => {
                this.setState({
                    menuData: responseJson,
                }, () => { console.log(this.state.menuData), this.sortMenuData() });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    addItem(name, id, price) {
        var newCartItems = [];
        var updatedCartItems = this.state.cartItems

        if (updatedCartItems.find(data => data.itemid == id)) {
            var index = updatedCartItems.findIndex(data => data.itemid == id)
            updatedCartItems[index].amount += 1
            updatedCartItems[index].price += Number(price)

            this.setState({
                counterUpdate: this.state.counterUpdate += 1
            })
            return console.log("increased item by 1")
        } else {
            newCartItems.push({ itemid: id, dish: name, amount: 1, price: Number(price) });
            this.setState({
                cartItems: [...this.state.cartItems, ...newCartItems]
            });

            this.setState({
                counterUpdate: this.state.counterUpdate += 1
            })
            return console.log("added item")
        }
    }

    getTable() {
        let url = window.location.pathname
        this.setState({
            table: url.substr(7)
        })
    }

    remItem(id, price) {
        var updatedCartItems = this.state.cartItems

        if (updatedCartItems.find(data => data.itemid == id)) {
            var index = updatedCartItems.findIndex(data => data.itemid == id)

            switch (true) {
                case updatedCartItems[index].amount == 1: {
                    updatedCartItems.splice(index, 1)

                    this.setState({
                        counterUpdate: this.state.counterUpdate += 1
                    })
                    return console.log("removed item")
                }
                case updatedCartItems[index].amount > 1: {
                    updatedCartItems[index].amount -= 1
                    updatedCartItems[index].price -= Number(price)
                    this.setState({
                        counterUpdate: this.state.counterUpdate += 1
                    })
                    return console.log("reduced item by 1")
                }
            }
        } else {
            return
        }
    }

    goToCheckout() {
        console.log(this.state.cartItems);
        if (!this.state.cartItems.length > 0) {
            toast.show("Cart is Empty", { type: 'danger' })
        }
        else {
            this.props.navigation.navigate("Checkout", { cart: this.state.cartItems, tableNumber: this.state.table });
        }
    }

    getAmount = (id) => {
        const carts = this.state.cartItems
        if (carts.find(data => data.itemid == id)) {
            var index = carts.findIndex(data => data.itemid == id)
            return "x" + carts[index].amount
        } else {
            return ""
        }
    }

    isItemSpecial = (id) => {
        if (this.state.menuData.find(data => data.id == id)) {
            var index = this.state.menuData.findIndex(data => data.id == id)

            switch (true) {
                case Number(this.state.menuData[index].special) == 1: {
                    return "*special*"
                }
                default: {
                    return ""
                }
            }
        }
    }

    sortMenuData() {
        var arr = this.state.menuData;
        var foo = {};
        foo['title'] = 'Food';
        foo['data'] = [];
        var dri = {};
        dri['title'] = 'Drinks';
        dri['data'] = [];
        var des = {};
        des['title'] = 'Desserts';
        des['data'] = [];

        for (let i = 0; i < arr.length; i++) {
            if (arr[i].type == 1) {
                foo['data'].push(arr[i]);
            }
            else if (arr[i].type == 2) {
                dri['data'].push(arr[i]);
            }
            else if (arr[i].type == 3) {
                des['data'].push(arr[i]);
            }
        }
        var finish = [];
        finish.push(foo);
        finish.push(dri);
        finish.push(des);
        this.setState({
            food: foo,
            drinks: dri,
            desserts: des,
            allMenuData: finish,
            isLoading: false,
        })
    }

    componentDidMount() {
        this.getTable();
        this.getMenu();
    }

    render() {
        if (this.state.isLoading == true) {
            return (
                <View style={[{ top: '50%' }]}>
                    <ActivityIndicator />
                </View>
            )
        }
        return (
            <View style={[styles.viewHome]}>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.cartModal}
                    onRequestClose={() => {
                        this.setState({ cartModal: false });
                    }}>
                    <TouchableOpacity
                        style={[styles.modalClickOff]}
                        activeOpacity={1}
                        onPress={() => { this.setState({ cartModal: false }) }}
                    >
                        <TouchableHighlight style={[styles.modalTouchableHighlightCart]}>
                            <View style={[styles.modalView]}>
                                <FlatList
                                    style={[{ alignSelf: 'center', width: '80%', height: '70%', marginTop:'5%' }]}
                                    data={this.state.cartItems}
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
                                                <View style={[{ flex: 1, height: 60, marginTop: -20 }]}>
                                                    <Text style={[styles.menuText, { fontSize: 16 }]}>£{item.price / 100}
                                                    </Text>
                                                </View>
                                            </View>)
                                    }}
                                />
                                <TouchableOpacity
                                    style={[styles.modalButton]}
                                    onPress={() => { this.setState({ cartModal: false }), this.goToCheckout() }}>
                                    <Text style={[styles.modalButtonText,]}>
                                        Checkout
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButtonCancel]}
                                    onPress={() => { this.setState({ cartModal: false }); }}>
                                    <Text style={[styles.modalButtonText,]}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableHighlight>
                    </TouchableOpacity>
                </Modal>

                <View style={[{ flex: 1, flexDirection: 'row' }]}>
                    <View style={[{ flex: 1, }]}>
                    </View>
                    <View style={[{ flex: 2, alignSelf: 'center', alignItems: 'center' }]}>
                        <Text style={[styles.text,]}>
                            Table: {this.state.table}
                        </Text>
                    </View>
                    <View style={[{ flex: 1, alignSelf: 'flex-end' }]}>
                        <TouchableOpacity style={[styles.cartBtn, { marginTop: -60 }]} onPress={() => this.setState({ cartModal: true })}>
                            <Image style={[styles.cartLogo]} source={require('./assets/images/basket.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView style={[{ flex: 8, }]}>
                    <SectionList
                        extraData={this.state.counterUpdate}
                        sections={this.state.allMenuData}
                        keyExtractor={item => item.id}
                        renderSectionHeader={({ section: { title } }) => (
                            <Text style={[styles.text, { fontSize: 30 }]}>{title}</Text>
                        )}
                        renderItem={({ item }) => {
                            if (item.available == 0) {
                                return (
                                    <View style={[{ flex: 1, flexDirection: 'column', marginTop: 5 }]}>
                                        <View style={[{ flex: 3, flexDirection: 'row', }]}>
                                            <View style={[{ flex: 9, height: 60, }]}>
                                                <Text style={[styles.menuText, { fontSize: 20, color: 'gray' }]}>
                                                    {item.dish}
                                                </Text>
                                            </View>
                                            <View style={[{ flex: 2, }]}>
                                                <Text style={[styles.menuText, { fontSize: 15 }]}>{this.getAmount(item.id)}
                                                </Text>
                                            </View>
                                            <View style={[{ flex: 3, flexDirection: 'row', height: 70 }]}>
                                            </View>
                                        </View>
                                        <View style={[{ flex: 2, flexDirection: 'column', }]}>

                                            <View style={[{ flex: 1, flexDirection: 'row', }]}>
                                                <View style={[{ flex: 7, marginTop: -15, }]}>
                                                    <Text style={[styles.menuTextDesc, { fontSize: 12, color: 'gray' }]}>{item.desc}
                                                    </Text>
                                                    <View style={[{ flex: 1, flexDirection: 'row' }]}>
                                                        <View style={[{ flex: 3, marginTop: 0, }]}>
                                                            <Text style={[styles.menuText, { fontSize: 20, color: 'gray' }]}>
                                                                unavailable
                                                            </Text>
                                                        </View>
                                                        <View style={[{ flex: 1, marginTop: 0, }]}>
                                                        </View>
                                                        <View style={[{ flex: 1, marginTop: 0, }]}>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={[{ flex: 1, }]}>
                                                </View>
                                                <View style={[{ flex: 2, }]}>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )
                            }
                            return (
                                <View style={[{ flex: 1, flexDirection: 'column', marginTop: 5 }]}>
                                    <View style={[{ flex: 3, flexDirection: 'row', }]}>
                                        <View style={[{ flex: 9, height: 60, }]}>
                                            <Text style={[styles.menuText, { fontSize: 20 }]}>
                                                {item.dish}
                                            </Text>
                                        </View>
                                        <View style={[{ flex: 2, }]}>
                                            <Text style={[styles.menuText, { fontSize: 15 }]}>{this.getAmount(item.id)}
                                            </Text>
                                        </View>
                                        <View style={[{ flex: 3, flexDirection: 'row', height: 70 }]}>
                                            <TouchableOpacity
                                                style={[styles.cartAddBtn, { flex: 1, height: '45%' }]}
                                                onPress={() => { this.remItem(item.id, item.price) }}>
                                                <Text style={[styles.cartAddBtnText,]}>-</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.cartAddBtn, { flex: 1, height: '45%' }]}
                                                onPress={() => { this.addItem(item.dish, item.id, item.price) }}>
                                                <Text style={[styles.cartAddBtnText,]}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={[{ flex: 2, flexDirection: 'column', }]}>
                                        <View style={[{ flex: 1, flexDirection: 'row', }]}>
                                            <View style={[{ flex: 7, marginTop: -15, }]}>
                                                <Text style={[styles.menuTextDesc, { fontSize: 12 }]}>{item.desc}
                                                </Text>
                                                <View style={[{ flex: 1, flexDirection: 'row' }]}>
                                                    <View style={[{ flex: 3, marginTop: 0, }]}>
                                                        <Text style={[styles.menuTextDesc, { fontSize: 18, marginTop: 5 }]}>£{item.price / 100}
                                                        </Text>
                                                    </View>
                                                    <View style={[{ flex: 3, marginTop: 0, }]}>
                                                        <Text style={[styles.menuTextDesc, { color: 'red', fontSize: 18, marginTop: 5, marginLeft: -30 }]}>{this.isItemSpecial(item.id)}
                                                        </Text>
                                                    </View>
                                                    <View style={[{ flex: 1, marginTop: 0, }]}>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={[{ flex: 1, }]}>
                                            </View>
                                            <View style={[{ flex: 2, }]}>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                        }
                        }
                    />
                </ScrollView>
            </View>
        );
    }
}
