const errorCatch = require("./../features/errorCatch")
const errHandling = require('./../features/errHandling')
const Tour = require('./../models/tourmodel')
const APIFeatures = require('./../features/apiFeatures')


exports.factoryDel = (Model) => errorCatch(async (req, res, next) => {
    const eId = req.params.id
    const doc = await Model.findByIdAndDelete(eId)
    if (!doc) {
        return next(new errHandling(`can't find a document with this id`, 404))
    }
    res.status(200).json({
        "status": "success",
        "data": {
            "message": "data is deleted"
        }
    })
})


exports.factoryUp = Model => errorCatch(async (req, res, next) => {
    if (req.files) { 
        req.body.imageCover = req.files.imageCover[0].filename
        req.body.images = [];
        req.files.image.forEach(el =>{
            req.body.images.push(el.filename)
        })
        // console.log(req.body.image);
     }

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    if (!doc) {return next(new errHandling(`can't find a docs with this id`, 404))}
    res.status(200).json({
        "status": "success",
        "data": {
            doc
        }
    })
})

exports.factoryCrt = Model => errorCatch(async (req, res, next) => {
    const doc = await Model.create(req.body)
    res.status(200).json({
        "status": "success",
        "data": {
            doc
        }
    })
})

exports.factoryFd = (Model,isPopulated) =>  errorCatch(async (req, res, next) => {
let query =  Model.findById(req.params.id)
if(isPopulated) query = query.populate(isPopulated)
    const doc = await query;
    if (!doc) {
        return next(new errHandling(`can't find a doc with this id`, 404))
    }



    res.status(200).json({
        "status": "success",
        "data": {
            "data":doc
        }
    })
})

exports.getAll = Model => errorCatch(async (req, res, next) => {

    let filter = {}
    if (req.params.tourId) filter = {
        tour: req.params.tourId
    }
    const feature = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .fields()
        .paginate();
    const doc = await feature.query
    res.status(200).json({
        status: "success",
        results: doc.length,
        data: {
            data:doc
        }
    })
})
