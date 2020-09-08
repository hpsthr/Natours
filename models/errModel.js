const errHandling = require('./../features/errHandling')


const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}:${err.value} Error`
    return new errHandling(message, 400)
}

const handleCasterrorCodeDB = err => {

    const name = err.keyValue.email
    const message = `[${name}] Email Field Already Exist`
    return new errHandling(message, 400)
}

const handleValidationErrorDB = err => {
    const error = Object.values(err.errors).map(el => el.message)
    // const errMsg = err.errors.ratingsAverage.properties.message
    // const value = err.errors.ratingsAverage.properties.value
    const message = `Type a valid information Such as. ---${error.join(". ---" )}`
    return new errHandling(message, 400)
}

const handleToken = err => new errHandling("Invalid Token please login again", 401)
const handleExpire = err => new errHandling("Token is expired please login again", 401)

const sendErrDev = (err, req, res) => {

    if (req.originalUrl.startsWith("/api")) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            eror: err.name,
            message: err.message,
            stack: err.stack
        })
    }
    return res.status(err.statusCode).render("error", {
        title: "Some thing went wrong",
        msg: err.message
    })

}





const sendErrPro = (err , req, res) => {
    if (req.originalUrl.startsWith("/api")) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            })
        }


        return res.status(err.statusCode).json({
            status: "fail",
            message: "Something Went terribly Wrong"
        })
    }
    if (err.isOperational) {
        return res.status(err.statusCode).render("error", {
            title: "Some thing went wrong",
            msg: err.message
        })
        
    }
    return res.status(err.statusCode).render("error", {
        title: "Some thing went wrong",
        msg: "Please try again later"
    })
}



module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500
    err.status = err.status || "error"
    if (process.env.NODE_ENV === "development") {
        sendErrDev(err, req, res)
    } else if (process.env.NODE_ENV === "production") {
        let error = {
            ...err
        }
        // console.log(err.code)


        if (err.name === "CastError") err = handleCastErrorDB(err)
        if (err.code === 11000) err = handleCasterrorCodeDB(err)
        if (err.name === "ValidationError") err = handleValidationErrorDB(err)
        if (err.name === "JsonWebTokenError") err = handleToken(err)
        if (err.name === 'TokenExpiredError') err = handleExpire(err)
        sendErrPro(err, req, res)

    }

}