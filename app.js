const path = require('path');
const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const bodyparser = require("body-parser")
const mongoSanitize = require("express-mongo-sanitize")
const compression = require("compression")
const xss = require("xss-clean")
const hpp = require("hpp")
const cors = require("cors")
const toursRouter = require('./routers/toursRouter')
const bookingRouter = require('./routers/bookingRouter')
const userRouter = require('./routers/userRoutes')
const reviewRouter = require('./routers/reviewRouter')
const viewRouter = require('./routers/viewRouter')
const errHandling = require('./features/errHandling') 
const globalErrorHandler = require("./models/errModel")
const converter = require("nodejs-currency-converter");
const cookieParser = require('cookie-parser');


const app = express();

app.enable('trust proxy')

app.set("view engine", "pug")
app.set("views", path.join(__dirname, 'views'))
app.use(express.static(path.join( __dirname, "public")))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))
app.use(cors()) // allow all cross  domain requests for our api
app.option("*", cors()); // it allow to all route that pass cross domain/planform request



app.use(helmet())
const limiter = rateLimit({
    max:100,
    windowMs:60 * 60 * 1000,
    message:"MALICIOUS USER too many requests at the same time"
})
app.use('/api', limiter)

app.use(express.json({ limit:"10kb"})) 
app.use(cookieParser())
app.use(mongoSanitize())
app.use(xss())
app.use(hpp({whitelist:["duration","price"]}))
app.use(morgan("dev"));

app.use(compression()); 


app.use("/api/v1/tours", toursRouter)
app.use('/api/v1/users', userRouter);
app.use("/api/v1/reviews", reviewRouter)
app.use("/api/v1/booking",bookingRouter)
app.use("/",viewRouter)


app.all("*",(req,res,next) => {next(new errHandling("can't find " + req.originalUrl +" on this server",404));})

app.use(globalErrorHandler)
module.exports = app;



