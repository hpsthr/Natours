const mongoose = require('mongoose')
const globalErrorHandler = require("./errModel")
const errorCatch = require("./../features/errorCatch")
const User = require("./userModel")
const slugify = require('slugify');
const {
  Receipt,
  Item,
  ObjectId
} = require("./../models/receiptModel")

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD)

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(doc => {
  console.log("DB has established @ " + (doc.connections[0].name) + " with " + (doc.connections[0].user))
})

const toursSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name must have less or equal then 40 characters'],
    minlength: [10, 'A tour name must have more or equal then 10 characters']
    // validate: [validator.isAlpha, 'Tour name must only contain characters']
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  participants: {
    type: Number,
    default: 0,
    validate: {
      validator: function (val) {
        const sum = this.maxGroupSize * this.startDates.length
        return val <= sum
      },
      message: 'No more participants Allowed'
  }},
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, difficult'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: value => Math.round(value * 10 / 10)
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (val) {
        // this only points to current doc on NEW document creation
        return val < this.price;
      },
      message: 'Discount price ({VALUE}) should be below regular price'
    }
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  },
  guides: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  startLocation: {
    type: {
      type: String,
      default: "Point",
      enum: ["Point"]
    },
    coordinates: [Number],
    address: String,
    description: String
  },
  locations: [{
    type: {
      type: String,
      default: "Point",
      enum: ["Point"]
    },
    coordinates: [Number],
    address: String,
    description: String,
    day: Number,

  }],

}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
})

toursSchema.index({
  startLocation: '2dsphere'
})
toursSchema.index({
  price: 1,
  ratingAverage: -1
})
toursSchema.index({
  slug: 1
})


toursSchema.virtual("durationOfWeek")
  .get(function () {
    return this.duration / 7;
  })

toursSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id"
})

// toursSchema.virtual("participation")
//   .get( async function  () {
//     const stats = await Receipt.find({
//       "item.tour": this.id , payment_id:{$regex:/^pay/}
//     }, "item.$.item")
//     const total = stats.map(el => el.item.map(el => el.item))
//     const filt = total.map(el => el.toString())
//     const nextArr = filt.map(el => el = parseInt(el, 10))

//     const finalItem = await Promise.all(nextArr.reduce((a, b) => a + b, 0)) 
//     return finalItem
//   })


toursSchema.pre(/^find/, function (next) {
  this.find({
    secretTour: {
      $ne: true
    }
  });
  next();
})

toursSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordMod"
  })
  next();
})


toursSchema.pre('save', function (next) {
  this.slug = slugify(this.name, {
    lower: true
  });
  next();
});


toursSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: {
      secretTour: {
        $ne: true
      }
    }
  });
  next();
})

// toursSchema.pre("save",async function(next){
//   const guidePromise = this.guides.map(async id => await User.findById(id))
//    this.guides = await Promise.all(guidePromise)
//   next();
// })
const Tour = mongoose.model('Tour', toursSchema)


module.exports = Tour