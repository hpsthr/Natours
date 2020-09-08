const {
    promisify,
    isNullOrUndefined
} = require('util')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const {User} = require("./../models/userModel")
const errHandling = require("./../features/errHandling")
const Email = require("./../features/email")

const errorCatch = require("./../features/errorCatch")







const signToken = id => jwt.sign({
    id
}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
})

 const tokenHandler = (user, statusCode, req, res, message) => {
    const token = signToken(user._id)
    const cookieOptions = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: req.secure || req.headers("x-forwarded-proto") === "https"
    }
    res.cookie('jwt', token, cookieOptions)
     
    user.password = undefined;
    if (user.verificationToken) {
        user.verificationToken = undefined;
        user.verificationTimeOut = undefined;
        user.emailVerified = undefined;
    }
    res.status(statusCode).json({
        status: 'success',
        token,
        user,
        message
    })

}

exports.signup =
    errorCatch(async (req, res, next) => {
        const newUser = await User.create({
            
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            passwordMod: req.body.passwordMod,
            passwordResetToken: req.body.passwordResetToken,
            passwordResetTime: req.body.passwordResetTime,
            verificationToken: req.body.verificaionToken,
            verificationTimeOut: req.body.verificationTimeOut
        })

        const url = `${req.protocol}://${req.get("host")}/me`
            await new Email(newUser, url).sendWelcome();
        verUser = newUser;

            

        next();

    })
    exports.sendEmailVerification = async (req, res, next) => {
        const token = signToken(verUser._id)
        const verificationToken = verUser.emailVerificationToken()
        verUser.save({
            validateBeforeSave: false
        })


        const verifiedURL = `${req.protocol}://${req.get("host")}/verifyuser/${verificationToken}`
        try {
            await new Email(verUser, verifiedURL).sendVerification()
            tokenHandler(verUser, 201, req, res, "verification link has sended to your account")

        } catch (err) {
            verUser.verificationToken = undefined;
            verUser.verificationTimeOut = undefined;
            await user.save({
                validateBeforeSave: false
            })
            return next(new errHandling("Varificaion link failed click on link to verify again", 404))
        }
    }



exports.login = errorCatch(async (req, res, next) => {
    const {
        email,
        password
    } = req.body
    if (!email || !password) {
        return next(new errHandling("Please Provide Email and Password", 500))
    }

    const user = await User.findOne({
        email
    }).select('+password')


    if (!user || !(await user.authPass(password, user.password))) {
        return next(new errHandling("incorrect username and password", 401))
    }
    tokenHandler(user, 201, req, res, "")

})



exports.authorizetion = errorCatch(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt
    }

    if (!token) {
        return next(new errHandling("You are not login please login to access this route", 401))
    }

    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    const freshUser = await User.findById(decode.id)

    if (!freshUser) {
        return next(new errHandling("No User Exists or Removed By Admin", 401))
    }
    if (freshUser.tokenTime(decode.iat)) {
        return next(new errHandling("user changed password recently please login to get access", 401))
    }

    req.user = freshUser;
    res.locals.user = freshUser;

    next();
})


exports.isLoggedIn = async (req, res, next) => {
    try {
        if (req.cookies.jwt) {
            const decode = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)
            const freshUser = await User.findById(decode.id)
            if (!freshUser) {
                return next(new errHandling("user does't exists in our database", 401))
            }
            if (freshUser.tokenTime(decode.iat)) {

                return next(new errHandling("user changed password recently please login to get access", 401))
            }

            res.locals.user = freshUser
            return next()
        }
        next();

    } catch (err) {
        return next()
    }
}



exports.verifyEmail = errorCatch(async (req, res, next) => {
    const vToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const verifyUser = await User.findOne({
        verificationToken: vToken,
        verificationTimeOut: {
            $gt: Date.now()
        }
    })

    if (!verifyUser) {
        return next(new errHandling("user not exist please provide valid token"))
    }

    const upID = await User.findByIdAndUpdate(verifyUser._id, {
        emailVerified: true,
        $unset: {
            verificationToken: 1,
            verificationTimeOut: 1
        }
    })
verifiedEmail = upID
next()
    
})

exports.confirmVerification = (req, res, next) => {
   tokenHandler(verifiedEmail, 201, req, res, "you verified this email ")
    
}


exports.isVerified = errorCatch(async (req, res, next) => {

    if (!req.user.emailVerified) {
        return next(new errHandling("Your Verification link has send to your email id Please verify Your Email"))
    }
    next();
})


exports.toAccess = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new errHandling("you don't have permission to access this route ", 403))
        }
        next();

    }
}

exports.forgotPassword = async (req, res, next) => {
    console.log(req.body.email);
    const resetUser = await User.findOne({
        email: req.body.email
    })
    if (!resetUser) {
        return next(new errHandling("user not exists please make sure your email is correct", 401))
    }
    const resetToken = resetUser.createPasswordResetToken();
    await resetUser.save({
        validateBeforeSave: false
    })
    const resetURL = `${req.protocol}://${req.get("host")}/reset-password/${resetToken}`;
    const message = `forget your password click on this like to reset ${resetURL}.\n If you don't forget simply login with user name and password`
    try {
        const sendLink = await new Email(resetUser, resetURL).resetPassword();
        res.status(200).json({
            status: "success",
            message: "your password token has been send"
        })
    } catch (err) {
        resetUser.passwordResetToken = undefined;
        resetUser.passwordResetTime = undefined;
        await user.save({
            validateBeforeSave: false
        })
        return next(new errHandling("There is somerror please try again later", 404))
    }
}


exports.resetPassword = errorCatch(async (req, res, next) => {
    if(!req.params.token){req.body.token = req.params.token}
    
    const cryptedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const resetUser = await User.findOne({
        passwordResetToken: cryptedToken,
        passwordResetTime: {
            $gt: Date.now()
        }
    })
    if (!resetUser) {
        return next(new errHandling("resetUser doen't exist at this moment try again ", 404))
    }
    resetUser.password = req.body.password,
        resetUser.passwordConfirm = req.body.passwordConfirm,
        resetUser.passwordResetToken = undefined,
        resetUser.passwordResetTime = undefined

    await resetUser.save()
    tokenHandler(resetUser, 201, req, res, "")
});


exports.updatePassword = errorCatch(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password")
    if (!(await user.authPass(req.body.currentPassword, user.password))) {
        return next(new errHandling("wrong user password please type current password", 401))
    };
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    await user.save()

    tokenHandler(user, 200, req, res, "Password update successfully")


})

exports.logOut = (req, res, next) => {
    res
        .cookie('jwt', "thisisaexpiredtokenforthisite", {
            expires: new Date(Date.now() + 10000),
            httpOnly: true
        })
        .status(200)
        .json({
            status: "success"
        })

}