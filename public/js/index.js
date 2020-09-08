import "@babel/polyfill"
import {tMap} from "./mapbox"
import {login ,signup} from "./login"
import {logout} from "./logout"
import {updateInfo, updatePass} from "./updateData"
import {bookTour} from "./razor"
import{addToCart, removeFromCart, increseCart, decreaseCart} from "./cart"
import {submitReview, editReview} from "./submitreview"
import {resetPassword, forgotPass} from "./password"




const qMap = document.getElementById("map")
const loginUser = document.querySelector(".form-login")
const outUser = document.querySelector(".nav__el--logout")
const upUser = document.querySelector(".form-user-data")
const passUser = document.querySelector(".form-user-settings")
const signUser = document.querySelector(".form-signup")
const bookBtn = document.getElementById("book-tour")
const rmvBtn = document.querySelectorAll(".cart-rmv")
const checkOut = document.getElementById("checkout-btn")
const increaseItem = document.querySelectorAll(".cart-inc")
const decreaseItem = document.querySelectorAll(".cart-dec")
const reviewStar = document.querySelectorAll(".review-star")
const postReview = document.getElementById("post-review")
const edtReview = document.getElementById("edit-review")
const resetPass = document.getElementById("reset_pass")
const forgotPassword = document.getElementById("forgot_password")







// var openFile = function(event) {
//     var input = event.target;

//     var reader = new FileReader();
//     reader.onload = function(){
//       var dataURL = reader.result;
//       var output = document.getElementById('output');
//       output.src = dataURL;
//     };
//     reader.readAsDataURL(input.files[0]);
//   };



if (qMap) {

    const locations = JSON.parse(qMap.dataset.locations)
    tMap(locations)
}

if (loginUser) {
    loginUser.addEventListener("submit", e => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        console.log(email, password);
        login(email, password)
    });
}

if (outUser) {
    outUser.addEventListener("click", logout)
}

if (upUser) {
    upUser.addEventListener("submit", e => {
        e.preventDefault();
        const form = new FormData()
        form.append("name", document.getElementById("name").value )
        form.append("email", document.getElementById("email").value )
        form.append("photo", document.getElementById("photo").files[0] )
        
        
        updateInfo(form, "data")
    })
}

if(passUser){
    passUser.addEventListener("submit", async e => {
        e.preventDefault();
        document.querySelector(".btn-savepass").textContent = "Updating ..."
        const currentPassword = document.getElementById("password-current").value
        const password = document.getElementById("password").value
        const passwordConfirm = document.getElementById("password-confirm").value
        await updatePass(currentPassword, password, passwordConfirm)
        console.log(currentPassword, password, passwordConfirm);
        document.querySelector(".btn-savepass").textContent = "Save Password"
         document.getElementById("password-current").value = ""
         document.getElementById("password").value= ""
         document.getElementById("password-confirm").value = ""

})
}


if(signUser){
    signUser.addEventListener("submit", async e => {
        e.preventDefault();
        document.querySelector(".btn-signup").textContent = "Registering You In ..."
        const firstName = document.getElementById("first-name").value
        const lastName = document.getElementById("last-name").value
        const name = `${firstName} ${lastName}`
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value
        const passwordConfirm = document.getElementById("password-confirm").value

        await signup(name,email, password, passwordConfirm)
        console.log(name, email, password, passwordConfirm);
        document.querySelector(".btn-signup").textContent = "Sign Up"
         document.getElementById("password").value= ""
         document.getElementById("password-confirm").value = ""

})
}

if(bookBtn){
    
    bookBtn.addEventListener("click", el => {
        el.target.textContent = "Processing..."
        window.setTimeout(() => {
            el.target.textContent = "Book Tour Now" 
        },5000)
    const {tourId}= el.target.dataset
    
    const email = document.querySelector(".hidden--element").innerText
    const name = document.querySelector(".user--name").innerText
    // bookTour(tourId,tourName,email,name)
    addToCart(tourId)
    el.preventDefault();

    })
}

if(rmvBtn){
    rmvBtn.forEach(btn => {
        btn.addEventListener("click", el => {
            console.log("clicked");
            el.target.textContent = "Removing..."
            const {tourId} = el.target.dataset
            removeFromCart(tourId)
        })

    })

}

if(checkOut){
    checkOut.addEventListener("click", el => {
        el.target.textContent = "Processing..."
        window.setTimeout(() => {
            el.target.textContent = "checkout" 
        },5000)
        const email = document.querySelector(".hidden--element").innerText
    const name = document.querySelector(".user--name").innerText
        bookTour(email,name);
        el.preventDefault();

    })
}

if(increaseItem){
    increaseItem.forEach(eli => {
        eli.addEventListener("click", el => {
        const {tourId}= el.target.dataset
        increseCart(tourId)
})})
    
}
if(decreaseItem){
    decreaseItem.forEach(eld => {
        eld.addEventListener("click", el => {
        const {tourId}= el.target.dataset
    decreaseCart(tourId)
})})
    
}


if(reviewStar){
   
    
}


if(reviewStar){
    let index;
    let value;
    reviewStar.forEach((el , i) => {
         el.addEventListener("mouseover",els => {
             
             for(let j = 0; j < reviewStar.length; j++ ){
                reviewStar[j].classList.remove("size-icon-active")
                reviewStar[j].classList.add("size-icon")
            }
            
            for(let j = 0; j <= i; j++ ){
                reviewStar[j].classList.remove("size-icon")
                reviewStar[j].classList.add("size-icon-active")
            }
            
           
        })


        el.addEventListener("click", els => {
           value = i + 1
           index = i
           
        })

        el.addEventListener("mouseout",els => {

            for(let j = 0; j < reviewStar.length; j++ ){
            reviewStar[j].classList.remove("size-icon-active")
            reviewStar[j].classList.add("size-icon")
        }
        
        for(let j = 0; j <= index; j++ ){
            reviewStar[j].classList.remove("size-icon")
            reviewStar[j].classList.add("size-icon-active")
        }
        })
    })

    if(postReview){
        postReview.addEventListener("click", el => {
            const {tourId, userId} = el.target.dataset
            const rating = value;
            const review = document.querySelector(".review_text").value
            submitReview(tourId, userId, rating, review)
            el.preventDefault();
        })
    }
    if(edtReview){
        edtReview.addEventListener("click", el => {
            const {tourId, userId} = el.target.dataset
            const rating = value;
            const review = document.querySelector(".review_text").value
            editReview(tourId, userId, rating, review)
            el.preventDefault();
        })
    }
    
}


if(resetPass){
    resetPass.addEventListener("click", el => {
    const {token} = el.target.dataset
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm_password").value;
    resetPassword(token, password, confirmPassword)
    el.preventDefault();
    

    })
}

if(forgotPassword){
    forgotPassword.addEventListener("click", el => {
        const email = document.getElementById("email").value;
        console.log(email);
        forgotPass(email);
        el.preventDefault();
        
    })
}
