const multer = require('multer');
const sharp = require('sharp')
const {User} = require('./../models/userModel')
const errorCatch = require("./../features/errorCatch")
const errHandling = require('./../features/errHandling')
const factory = require("./factoryController")


// const multerStorage = multer.diskStorage({
// destination: (req, file, cb) => {
//     cb(null, "./public/img/users/")
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user.id}--${Date.now()}.${ext}`)
//   }
// })

const multerStorage = multer.memoryStorage();

const multerFilter = (req,file, cb) => {
  if(file.mimetype.startsWith("image")) return cb(null, true)
  cb( new errHandling("This is not valid file please upload valid file", 400), false)
}


const upload = multer({
  storage:multerStorage,
  fileFilter:multerFilter
})


exports.userPhotoUpload = upload.single("photo");


exports.resizeUserPhoto = async (req,res,next) => {
  if(!req.file) return next();
  req.file.filename = `user-${req.user.id}--${Date.now()}.jpeg`
  
  await sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({quality:90}).toFile(`public/img/users/${req.file.filename}`)
  next()
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}



exports.updateMe = errorCatch(async (req, res, next) => {
  
  if (req.body.password || req.body.passwordConfirm) return next(new errHandling("for updating password go to /updateMyPassword ", 400))
  const filterObjects = filterObj(req.body, "name", "email")
  const emailTrue = await User.findOne({email: req.body.email})
  if (req.file) filterObjects.photo = req.file.filename
  if (!emailTrue && Object.keys(filterObjects).includes("email") || emailTrue && !Object.keys(filterObjects).includes("email")) filterObjects.emailVerified = false

  const updateUser = await User.findByIdAndUpdate(req.user.id, filterObjects, {
    new: true,
    runValidators: true
  })



  res.status(200).json({
    status: "success",
    data: {
      updateUser
    }
  })
})

exports.deleteMe = errorCatch(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false
  })
  res.status(201).json({
    status: "success",
    data: null
  })
})

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id
  next()
}




exports.getAllUsers = factory.getAll(User)
exports.getUser = factory.factoryFd(User)
exports.createUser = factory.factoryCrt(User)
exports.updateUser = factory.factoryUp(User);
exports.deleteUser = factory.factoryDel(User)