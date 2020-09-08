const Tour = require('../models/tourmodel')
const {Review} = require("./../models/reviewModel")
const {Receipt} = require("./../models/receiptModel")
const errorCatch = require("./../features/errorCatch")
const errHandling = require('./../features/errHandling');
const {tokenHandler} = require("./authController");
const { rawListeners } = require('../models/tourmodel');
const rateExchange = require('currency-converter')({
    CLIENTKEY: process.env.CLIENTKEY,
    fetchInterval: 3600000
});




exports.convertTo = errorCatch(async (req, res, next) => {
    let x;
    await rateExchange.rates("USD", "INR").then(val => x = val);
    value = x
    next();
})

exports.getHome = errorCatch(async (req, res, next) => {
    res.status(200).render('base', {
        tour: "The forest hiker"
    })
})

exports.getOverview = errorCatch(async (req, res, next) => {
    

    const tours = await Tour.find();
    res.status(200).render("overview", {
        title: "all tours",
        tours,
        value
    })
    if(!tours){
        return next(new errHandling("This route Don't Exists Please check URL" ,404))
    }

})

exports.getTour = errorCatch(async (req, res, next) => {
    const tour = await Tour.findOne({
        slug: req.params.tour
    }).populate({
        path: "reviews",
        fields: "review rating user"
    });
if(!tour){
    return next(new errHandling("This route Don't Exists Please check URL" ,404))
}
    res.status(200).render("tour", {
        title: `${tour.name} Tour`,
        tour,
    })
})

exports.login = errorCatch(async (req, res, next) => {
    res.status(200).render("login", {
        title: "Login Page",
    })


})
exports.signup = errorCatch(async (req, res, next) => {
    res.status(200).render("signup", {
        title: "Join us ",
    })


})

exports.me = errorCatch(async (req, res, next) => {
    users = req.user
    
    
    
    res.status(200).render("me",{
        title:users.name.split(" ")[0],
        users
    })
})

exports.confirmation = (req, res, next) => {
    users = verifiedEmail;
    res.status(200).render("verify",{
        title:"confirmation",
        users
        
    })
}

exports.getUserReview = errorCatch(async (req, res, next) => {
    users = req.user
    user= req.user
    
    const reviews = await Review.find({user: req.user.id}).populate({path:"tour", select:"slug name imageCover"})

    
   

    res.status(200).render("myreview", 
    {title:"this is me",
    user,
    reviews})
    
})


exports.getCart = errorCatch(async (req, res, next) => {
    users = req.user
    console.log(users.cart.map(user => user.tour.name));
    
    
    res.status(200).render("mycart",{
        title:`Item In MyCart`,
        users
    })
})

exports.getBookedTour = errorCatch(async (req, res, next) => {
    const booking = await Receipt.find({user:req.user.id})
    users = req.user.id
    res.status(200).render("booking",{
        title:"My Booking",
        booking,})

})

exports.writeReview = errorCatch(async (req, res, next) => {
    const tourId = req.params.tourId
    
    const tour = await Tour.findById(tourId)
    

    res.status(200).render("write",{
        title: "Review",
        tour
    })
    
})


exports.editReview = errorCatch(async (req, res, next) => {
    const tourId = req.params.tourId
    
    const tour = await Tour.findById(tourId)
    

    res.status(200).render("edit",{
        title: "Review",
        tour
    })
    
})

exports.resetPassword = errorCatch(async (req, res, next) => {
    const token = req.params.token

    res.status(200).render("passwordrst",{
        title: "Reset Your Password ",
        token
        
    })
})

exports.forgotPassword = errorCatch(async (req, res, next) => {
    res.status(200).render("forgotpass",{
        title: "Forgot Password",
        
        
    })
})