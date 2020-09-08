import axios  from 'axios'
import {showAlert} from './alert'


export const submitReview = async (tour, user, rating, review) => {

    try {
        const res = await axios({
            method: 'POST',
            url: "/api/v1/reviews/",
            data:{
                tour,
                user,
                rating,
                review
            }
        })
        if(res.data.status === "success") {
            showAlert("success","review successfully posted")
            window.setTimeout(() => {
                location.assign("/myreview");
                }, 800
                )
        }
    } catch (err) {
        showAlert("error", err.response.data.message);
        window.setTimeout(() => {
            location.assign("/");
            }, 800
            )
    
    }
}
export const editReview = async (tour, user, rating, review) => {

    try {
        const res = await axios({
            method: 'PATCH',
            url: "/api/v1/reviews/edit",
            data:{
                tour,
                user,
                rating,
                review
            }
        })
        if(res.data.status === "success") {
            showAlert("success","review successfully posted")
            window.setTimeout(() => {
                location.assign("/myreview");
                }, 800
                )
        }
    } catch (err) {
        showAlert("error", err.response.data.message);
        window.setTimeout(() => {
            location.assign("/");
            }, 800
            )
    
    }
}