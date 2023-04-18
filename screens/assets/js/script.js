import AsyncStorage from "@react-native-async-storage/async-storage";
totalCost = 0;

const cart = AsyncStorage.getItem("currentCart");
itemCart = JSON.parse(cart);
for(i=0; i<=itemCart.length; i++){
    quantity = itemCart[i].amount;
    itemCost = itemCart[i].price;
    totalCost += itemCost;
}

amountElement = Number(totalCost/100);

paypal.Buttons({
    style:{
        color: 'blue',
        shape: 'pill'
    },
    createOrder:function(data, action){
        return action.order.create({
            purchase_units:[{
                amount:{
                    value: amountElement
                }
            }]
        })
    },
    onApprove: function(data, actions){
        return actions.order.capture().then(function(details){
            console.log(details)
            window.location.replace('success.php');
        })
    },
    onCancel: function(data){
        location.reload();
    }
}).render('#paypal-button-container');