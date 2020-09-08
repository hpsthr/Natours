import axios from 'axios'
import {showAlert} from './alert'

export const addToCart = async tourId => {
    try{
        const res = await axios({
        method:"put",
        url:`/api/v1/booking/cartin/${tourId}`}) 
    if(res.data.status === "success") {
        showAlert("success","Added in cart")
        window.location.reload(true)
    }} 
    catch (err) {
        console.log(err);
        showAlert("error", err.response.data.message)
    }
    
}
export const removeFromCart = async tourId => {
    try{const res = await axios({
        method:"delete",
        url:`/api/v1/booking/cartout/${tourId}`}) 
    if(res.data.status === "success") {
        showAlert("success","Removed from cart")
        window.location.reload(true)
    }} 
    catch (err) {
        console.log(err);
        showAlert("error", "failed to add")
    }
    
}
export const increseCart = async tourId => {
    try {
        const res = await axios({
            method:"put",
            url:`/api/v1/booking/iteminc/${tourId}`
        })
        if(res.data.status === "success") {
            showAlert("success","You Increse Item")
            window.location.reload(true)
        } 
        
    } catch (error) {
        console.log(err);
        showAlert("error", "failed to add")
        }
}
export const decreaseCart = async tourId => {
    try {
        const res = await axios({
            method:"put",
            url:`/api/v1/booking/itemdec/${tourId}`
        })
        if(res.data.status === "success") {
            showAlert("success","You Derease Item")
            window.location.reload(true)
        } 
        
    } catch (error) {
        console.log(err);
        showAlert("error", "failed to add")
        }
}

