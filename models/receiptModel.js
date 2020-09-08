const mongoose = require('mongoose');
const errHandling = require("../features/errHandling");
const validator = require("validator");

const itemSchema = new mongoose.Schema({
    tour:{
        type: mongoose.Schema.ObjectId,
        unique: [true, "item already exists"],
        ref: 'Tour'
    },
    item:{
        type:Number,
        default:1
    },
    startDates:{
        type:Date
    }
})


const receiptSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "User must exist for a Receipt"]
    },
    item: [itemSchema],
    order_id: {type:String,required:[true, "order must exists for receipt"]},
    payment_id:{type:String, default:"pending"},
    amount:Number,
    currency:String,
    receipt:{type:String, default:Date.now()},
    created_at:Number



})




receiptSchema.pre(/^find/, function (next) {
    this.populate({path:"item.tour", select:"name price imageCover description"})
    this.populate({
        path: "user",
        select: "name "
    })
    next();
})

receiptSchema.statics.maxGroupSize = async function (tourId) {
    const stats = await this.aggregate([
        {$unwind:$array}
        ,{
            $match: {
                "item.tour": tourId
            }
        },
        {
            $group: {
                _id: "$item.tour",
                nGroupSize: {
                    $sum: -1
                },
                avgRating: {
                    $avg: "$rating"
                }
            }
        }
    ])
}
// receiptSchema.static.calculateTour = async function(tourId) {
//     const group = await this.aggregate({
        
//     })
// }

const Receipt = new mongoose.model("Receipt", receiptSchema);
const Item = new mongoose.model("Item", itemSchema);
const ObjectId = mongoose.Types.ObjectId
module.exports = {Receipt, Item, ObjectId}