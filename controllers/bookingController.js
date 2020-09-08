const Razorpay = require('razorpay')
const errorCatch = require("./../features/errorCatch")
const errHandling = require("./../features/errHandling")
const Tour = require("./../models/tourmodel")
const {User, Cart} = require("./../models/userModel")
const factory = require("./factoryController")
const {Receipt, Item ,ObjectId} = require("./../models/receiptModel")
const crypto = require('crypto')
const {Review} = require('../models/reviewModel')




const razorpay = new Razorpay({
    key_id: process.env.RAZOR_ID,
    key_secret: process.env.RAZOR_SECRET_KEY
})



exports.getCheckoutSeassion = errorCatch(async (req, res, next) => {
    const tourID = req.params.tourId
    const tourByUser = await User.findById(req.user.id)
    const delRec = await Receipt.deleteMany({ user: req.user.id,receipt:{$lt:Date.now()-30000},payment_id:"pending"})
    // 
    // console.log(delRec);
    invoice = Date.now()
    let total = 0
    tourByUser.cart.forEach(tour => {

        total += tour.tour.price * 100 * tour.item
    })
    let bookedTour = [];
    tourByUser.cart.forEach(tour => {
        bookedTour.push(tour)
    })

    

    const options = {
        amount: total,
        currency: "USD",
        receipt: invoice,
        payment_capture: true
    };

    
    const orderData = await razorpay.orders.create(options)
    orderData.order_id = orderData.id
    orderData.user = req.user.id,
    orderData.item = bookedTour
    
    
    const saveData = await Receipt.create(orderData)
    
    res.status(200).json({
        status: "success",
        orderData,
        })
        
})


exports.getCapture = errorCatch(async (req, res, next) => {
    const secret = "%%Hpsthr$9426"
    const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
    const digest = shasum.digest('hex')
    // console.log(digest, req.headers["x-razorpay-signature"]);
    if(digest !== req.headers["x-razorpay-signature"])
    {
        return next(new errHandling("payment verification failed", 404))
    }
    // console.log("success");
    res.json({ status: 'ok' })
    next()
})

exports.regOrder = errorCatch(async (req, res, next) => {
    const orderId = req.body.payload.payment.entity.order_id
    const paymentId = req.body.payload.payment.entity.id
    // console.log(orderId);
    
    
     const upData = await Receipt.findOneAndUpdate({order_id:orderId},{payment_id:paymentId})
     const emptyCart = await User.findByIdAndUpdate(upData.user.id, {$set:{cart:[]}})
    
    //  console.log(upData);
    req.payment = upData
    next()
})


exports.addToCart = errorCatch( async (req, res, next) => {
    const cartItem =  new Cart({
        tour:req.params.tourId
    })
    const filter = await User.findOne({_id:req.user.id, "cart.tour":req.params.tourId})
    
    if(filter) {
        const updateI = await User.updateOne({_id:req.user.id, "cart.tour":req.params.tourId},{$inc:{"cart.$.item": 1}})
         res.status(200).json({ status: 'success', updateI})
         
        
        
    }
    else{
    const userCart = await User.findByIdAndUpdate(req.user.id, {$push:{cart:cartItem}})
    
    res.status(200).json({
        status: 'success',
        userCart
    })
}
})

exports.increseItem = errorCatch(async (req, res, next) => {
    
    const itemInc = await User.updateOne({_id:req.user.id, "cart.tour":req.params.tourId},{$inc:{"cart.$.item": 1}})

    res.status(200).json({
        status: 'success',
        itemInc
    })

})


exports.decreseItem = errorCatch(async (req, res, next) => {
    const find = await User.findOne({_id:req.user.id, "cart.tour":req.params.tourId},"cart.$.item")
    
    if(find.cart[0].item === 1){
    const rmUser = await User.findByIdAndUpdate(req.user.id, {$pull:{cart:{tour:req.params.tourId}}})
    res.status(200).json({
      status: 'success',
      rmUser
    })

    }
    else{
    const itemDec = await User.updateOne({_id:req.user.id, "cart.tour":req.params.tourId},{$inc:{"cart.$.item": -1}})
    
    res.status(200).json({
        status: 'success',
        itemDec
    })
    }
    
    

})

exports.delCart = errorCatch(async (req, res, next) => {
    
    const rmUser = await User.findByIdAndUpdate(req.user.id, {$pull:{cart:{tour:req.params.tourId}}})

    res.status(200).json({
      status: 'success',
      rmUser
    })
  })


  exports.bookingCheck = errorCatch(async (req, res, next) => {
      const receipt = await Receipt.find({user: req.user.id, "item.tour":{$in:{_id:req.params.tourId}}})
      
        if (receipt.length === 0) {return next(new errHandling("You Don't Purchase this to review",502))}
        
      next()
  })

exports.updateParticipants = errorCatch(async (req, res, next) => {
    
    const stats = await Receipt.findById(req.payment.id)
    const list = stats.item.map(item => item)
    for (let i = 0 ; i < list.length ; i++) {
        const tour =  await Tour.findByIdAndUpdate(list[i].tour.id, {$inc:{participants:list[i].item}})
        const sum = Math.floor(tour.participants/tour.maxGroupSize)
        const rec = await Receipt.findOneAndUpdate({_id:req.payment.id , "item.tour":list[i].tour.id}, {"item.$.startDates":tour.startDates[sum]})
}

})