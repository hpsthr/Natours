import axios from 'axios'
import {showAlert} from './alert'


export const login = async (email, password) => {



    try {
        const res = await axios({
            method: 'POST',
            url: "/api/v1/users/login",
            data: {
                email,
                password
            }
           
        })
        console.log(res.data);
        if(res.data.status === "success") {
            showAlert("success","You login successfully")
            window.setTimeout(() => {
                location.assign("/");
                }, 800
                )
        }
        console.log(res)
    } catch (err) {
        showAlert("error", err.response.data.message);
    }

}


export const signup = async (name, email, password, passwordConfirm) => {



    try {
        const res = await axios({
            method: 'POST',
            url: "/api/v1/users/signup",
            data: {
                name,
                email,
                password,
                passwordConfirm
            }
           
        })
        console.log(res.data);
        if(res.data.status === "success") {
            showAlert("success","successFully registered Verification link has been send to your email")
            window.setTimeout(() => {
                location.assign("/");
                },2000
                )
        }
        console.log(res)
    } catch (err) {
        showAlert("error", err.response.data.message);
    }

}



