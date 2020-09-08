import axios from 'axios'
import {showAlert} from './alert'


export const resetPassword = async (token, password, passwordConfirm) => {
    try {
        const res = await axios({
            method:"PATCH",
            url:`/api/v1/users/resetPassword/${token}`,
            data: {
            password,
            passwordConfirm}
        })
        if(res.data.status === "success") {
            showAlert("success","Your password is updated")
            window.setTimeout(() => {
                location.assign("/");
                }, 800
                )
        }
        
    } catch (err) {
        console.log(err);
        showAlert("error", err.response.data.message)
    }
}
export const forgotPass = async (email) => {
    try {
        const res = await axios({
            method:"POST",
            url:"/api/v1/users/forgotPassword",
            data: {
                email
            }
        })
        if(res.data.status === "success") {
            showAlert("success","Password Reset link has send to your Email Id")
            window.setTimeout(() => {
                location.assign("/");
                }, 800
                )
        }
        
    } catch (err) {
        console.log(err.response.data.error);
        showAlert("error", err.response.data.message)
    }
}