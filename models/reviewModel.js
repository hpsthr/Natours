const express = require('express')
const mongoose = require('mongoose')
const Tour = require('./../models/tourmodel')

const errorCatch = require("./../features/errorCatch")





const reviewSchema = new mongoose.Schema({

    rating: {
        type: Number,
        required: true,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    review: {
        type: String,
        max: [250, 'Revie should be less than 250 words']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "User must exist for a review"]
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: "Tour",
        ruquired: [true, "Tour must exist for a review"]
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})


reviewSchema.index({
    user: 1,
    tour: 1
}, {
    unique: true
});

// reviewSchema.pre("save", function (next){
//     const userFilter = this.find()
//     if(userFilter.tour && userFilter.user)return false

//     next()
// })

reviewSchema.pre(/^find/, function (next) {
    // this.populate({path:"tour", select:"name"})
    this.populate({
        path: "user",
        select: "name photo"
    })
    next();
})

reviewSchema.statics.calcAverageRating = async function (tourId) {
    const stats = await this.aggregate([{
            $match: {
                tour: tourId
            }
        },
        {
            $group: {
                _id: "$tour",
                nRating: {
                    $sum: 1
                },
                avgRating: {
                    $avg: "$rating"
                }
            }
        }
    ])

    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        })
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        })
    }

}

reviewSchema.post("save", function () {
    this.constructor.calcAverageRating(this.tour)
})


reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    // console.log(this.r);
    next();

})

reviewSchema.post(/^findOneAnd/, async function () {
    await this.r.constructor.calcAverageRating(this.r.tour)

})
const ObjectId = mongoose.Types.ObjectId

const Review = mongoose.model('Review', reviewSchema)

module.exports = {Review,ObjectId}