const dotenv = require('dotenv').config({
    path: './config.env'
})
const express = require('express')
const mongoose = require('mongoose')
const fs = require('fs')
const Tour = require("./../models/tourmodel")
const Review = require("./../models/reviewModel")
const User = require("./../models/userModel")

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD)

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true
}).then(doc => {
    console.log("DB has established @ " + (doc.connections[0].name) + " with " + (doc.connections[0].user))
}).catch(err => console.log("ERROR " + err))

const tourFile = JSON.parse(fs.readFileSync(__dirname + "/tours.json"))
// const userFile = JSON.parse(fs.readFileSync(__dirname + "/users.json"))
// const reviewFile = JSON.parse(fs.readFileSync(__dirname + "/reviews.json"))


const importData = async (req, res) => {
    try {
        const tour = await Tour.create(tourFile)
        // const user = await User.create(userFile, {validateBeforeSave: false})
        // const review = await Review.create(reviewFile)
        console.log("data is imported success fully ")
        process.exit()
        
        
    } catch (err) {
        console.log(err);
        
    }
}

const deleteData = async (req, res) => {
    try {
        const tour =await Tour.deleteMany()
        // const user = await User.deleteMany()
        // const review = await Review.deleteMany()
        console.log("data is deleted succesfully ");
        process.exit()
        
    }
    catch (err) {
        console.log(err);
        
    }
}


if(process.argv[2] === "--import" ){
importData()
}
else if (process.argv[2] === "--delete"){
    deleteData()
}
