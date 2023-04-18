import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    box:{
        backgroundColor: '#43baa6',
        margin: 5,
        borderRadius: 10,
        alignItems: 'center',
    },
    title:{
        color: '#ffffff'
    },
    text:{
        color: '#000000',
        margin: 15,
        fontSize: 25,
    },
    view:{
        marginTop: 45,
        padding: 5, 
        flex: 1, 
        justifyContent: 'flex-start'
    },
    viewHome:{
        padding: 5, 
        flex: 1, 
        justifyContent: 'flex-start',
    },
    cartBtn:{ 
        borderRadius: 5,
        backgroundColor:'#f4717f',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginTop: 5,
        marginHorizontal:5,
        marginBottom:10,
        position: 'absolute',
        width:81,
        height:50,
        activecity: 0.5,
        borderWidth:1,
        borderColor:'#000000',

    },
    cartBtnText:{ 
        color: '#000000',
        margin: 10,
        fontSize: 20,
    },
    menuDisp:{
        flex:1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        
    },
    menuText:{
        color: '#000000',
        margin: 10,
        fontSize: 20,
        flex:8,
    },
    cartAddBtn:{
        //backgroundColor: '#f4717f',
        margin: 5,
        borderRadius: 5,
        borderWidth:1,
        borderColor:'#000000',
        alignItems: 'center',
        flex:1,

    },
    cartAddBtnText:{
        color: '#000000',
        marginHorizontal:10,
        marginBottom: 5,
        fontSize: 20,
    },
    cartLogo:{
        marginHorizontal:5,
        marginTop:5,
        height: '80%',
        width: undefined,
        aspectRatio: 1,
    },
    menuTextDesc:{
        color: '#544e50',
        fontSize: 10,
        marginTop: -5,
        marginHorizontal: 11,
    },
    
})

export default styles;