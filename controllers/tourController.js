const multer = require('multer');
const sharp = require('sharp')
const express = require('express')
const factory = require('./factoryController')
const Tour = require('./../models/tourmodel')
const errorCatch = require("./../features/errorCatch")
const APIFeatures = require('./../features/apiFeatures')
const errHandling = require('./../features/errHandling')


const multerStorage = multer.memoryStorage();
 
const multerFilter = (req,file, cb) => {
  if(file.mimetype.startsWith("image")) return cb(null, true)
  cb( new errHandling("This is not valid file please upload valid file", 400), false)
}


const upload = multer({
  storage:multerStorage,
  fileFilter:multerFilter
})

exports.uploadMulti = upload.fields([
    {name:"imageCover", maxCount: 1},
    {name:"image", maxCount:3}
])
// exports.resizeUserPhoto = async (req,res,next) => {
//     if(!req.file) return next();
//     req.file.filename = `user-${req.user.id}--${Date.now()}.jpeg`
    
//     await sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({quality:90}).toFile(`public/img/users/${req.file.filename}`)
//     next()
//   };
exports.resizeTourPhoto = errorCatch(async (req,res,next) => {
    if(!req.files) return next()  
    if(!req.files.imageCover || !req.files.image) return next();
    // console.log(req.files)
    req.files.imageCover[0].filename = `tour-${req.params.id}--${Date.now()}-Cover.jpeg`
    await sharp(req.files.imageCover[0].buffer).resize(888, 500).toFormat('jpeg').jpeg({quality:100}).toFile(`public/img/tours/${req.files.imageCover[0].filename}`)
    
    await Promise.all(req.files.image.map(async (el, i )=> {
        el.filename = `tour-${req.params.id}--${Date.now()}-${i}.jpeg`
        await sharp(el.buffer).resize(888, 500).toFormat('jpeg').jpeg({quality:90}).toFile(`public/img/tours/${el.filename}`)
}))
    next()
  }); 

exports.getAliases = (req, res, next) => {
    req.query.limit = "5",
        req.query.sort = "-ratingsAverage,price",
        req.query.fields = "name,price,ratingsAverage,summary,difficulty"
    next();
}


exports.getAlltours = factory.getAll(Tour)
exports.getApitours = factory.factoryFd(Tour,{path:"reviews", select:"rating review"})
exports.getAllpost = factory.factoryCrt(Tour)
exports.getAllput = factory.factoryUp(Tour)
exports.getApiDelete = factory.factoryDel(Tour)




exports.getTourstates = errorCatch(async (req, res, next) => {

    const stats = await Tour.aggregate([{
            $match: {
                ratingsAverage: {
                    $gte: 4.5
                }
            }
        },
        {
            $group: {
                _id: "$ratingsAverage",
                numTours: {
                    $sum: 1
                },
                numRatings: {
                    $sum: "$ratingsQuantity"
                },
                avgRatings: {
                    $avg: "$ratingsAverage"
                },
                avgPrice: {
                    $avg: "$price"
                },
                minPrice: {
                    $min: "$price"
                },
                maxPrice: {
                    $max: "$price"
                }
            }
        },
        {
            $sort: {
                avgPrice: 1
            }
        }
    ])
    res.status(200).json({
        status: "success",

        data: {
            stats
        }
    })
})


exports.getDate = errorCatch(async (req, res, next) => {
    const year = req.params.year * 1;
const plan = await Tour.aggregate([{
            $unwind: "$startDates"
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(year + "-01-01"),
                    $lte: new Date(year + "-12-31")
                }
            }
        },
        {
            $group: {
                _id: {
                    $month: "$startDates"
                },
                numTourStarts: {
                    $sum: 1
                },
                tours: {
                    $push: "$name"
                }
            },
        },
        {
            $addFields: {
                month: "$_id"
            }
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $sort: {
                numTourStarts: -1,
                month: 1
            }
        }
    ])
    res.status(200).json({
        status: "success",
        data: {
            plan
        }
    })
})

exports.getTourWithin = errorCatch(async (req, res, next) => {
    const { distance, latlng, unit} = req.params
    const [lat ,lng] = latlng.split(',')

    if(!lat || !lng){
        next(new errorCatch("no lantitue and longitue has provided", 400))
    }
const radius = unit === "mi" ? distance/3963.2: distance/6378.1 
    // console.log(distance , lat, lng, unit);

    const findTour = await Tour.find({startLocation: {
        $geoWithin: { $centerSphere: [ [lng, lat], radius]}
    }})

    

    res.status(200).json({
        status: "success",
        result:findTour.length,
        data:{data:findTour}})
})