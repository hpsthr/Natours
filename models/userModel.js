const crypto = require('crypto');
const mongoose = require('mongoose');
const errHandling = require("./../features/errHandling");
const validator = require("validator");
const bcrypt = require('bcrypt');
const arryunique = require("mongoose-unique-array")

 const cartSchema = new mongoose.Schema({
    tour:{
        type: mongoose.Schema.ObjectId,
        unique: [true, "item already exists"],
        ref: 'Tour'
    },
    item:{
        type:Number,
        default:1
    }
})


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "this is requred fields"]
    },
    email: {
        type: String,
        required: [true, "this is requred fields"],
        unique: [true, "email exists provide different email"],
        lowercase: true,
        validate: [validator.isEmail, "please provide as a valid email"]

    },
    role: {
        type: String,
        required: true,
        enum: {
            values: ["admin","guide","lead-guide","user"],
            message: "this is invalid field"
        },
        default:"user"
    },
    emailVerified:{type:Boolean,default:false},
    active: {
        type: Boolean,
        default:true,
        select:false
    },
    photo: {
        type: String,
        default: "defAvatar.jpg"
    },
    password: {
        type: String,
        required: [true, "Password can't be empty"],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please conform password"],
        validate: {
            validator: function (el) {
                return el === this.password
            },
            message: "password are not the same"
        }
    },
    passwordMod: Date,
    passwordResetToken: String,
    passwordResetTime: Date,
    verificationToken: String,
    verificationTimeOut:Date,
    cart:[cartSchema]
})

userSchema.plugin(arryunique)

userSchema.pre(/^find/, function (next) {
    this.populate({
        path: "cart.tour",
        select: "name duration difficulty price maxGroupSize imageCover description"
    })
    next();
})

userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;

    next();
})

userSchema.pre("save", function (next){
    if(!this.isModified("password")|| this.isNew) return next();

    this.passwordMod = Date.now() - 1000;
    next();

})

userSchema.methods.authPass = function (currentPassword, userPassword) {
    return bcrypt.compare(currentPassword, userPassword)
}

userSchema.methods.tokenTime = function (JWTTimeStamp) {
    
    if (this.passwordMod) {
        const decodeSeconds = parseInt(this.passwordMod / 1000)
        return JWTTimeStamp < decodeSeconds;

    }

    return false;

}



userSchema.pre(/^find/, function (next){
    this.find({active:{$ne:false}})
    next();
})

userSchema.methods.emailVerificationToken = function(){
    const sendToken = crypto.randomBytes(32).toString("hex")
    this.verificationToken = crypto.createHash("sha256").update(sendToken).digest("hex")
    this.verificationTimeOut = new Date(Date.now()*1.001)
    return sendToken
}



userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex")
    this.passwordResetToken = crypto.createHash("sha256", ).update(resetToken).digest("hex");

    this.passwordResetTime = Date.now() + 10 * 60 * 1000;
    return resetToken
}


const Cart = new mongoose.model("Cart" ,cartSchema)
const User = new mongoose.model("User", userSchema);

module.exports = {User, Cart};
