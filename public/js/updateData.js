import axios from 'axios'
import {
    showAlert
} from './alert'
import {
    logout
} from './logout'

export const updateInfo = async (data, type) => {

    console.log(data);
    try {
        const res = await axios({
            method: 'PATCH',
            url: "/api/v1/users/updateMe",
            data,
        })
        console.log(res.data.data.updateUser.emailVerified);
        if (res.data.status === "success") {
            showAlert("success", "Your Data is Changed")
            location.reload(true);
        }
        if (res.data.data.updateUser.emailVerified === false) {
            logout();
            window.setTimeout(() => {
                location.reload(true);
            }, 800)
        }


    } catch (err) {
        console.log(err);
        showAlert("error", err.response.data.message);
    }
}


export const updatePass = async (currentPassword, password, passwordConfirm) => {

    try {
        console.log(passwordConfirm);
        const res = await axios({
            method: 'PATCH',
            url: "/api/v1/users/updateMyPassword",
            data: {
                currentPassword,
                password,
                passwordConfirm
            },

        })
        console.log(res.data);
        if (res.data.status === "success") {
            showAlert("success", "Your PassWord is Changed")
            logout();
            window.setTimeout(() => {
                location.reload(true);
            }, 1500)
        }



    } catch (err) {
        console.log(err);
        showAlert("error", err.response.data.message);
    }
}