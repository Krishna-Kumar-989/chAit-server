const express = require('express');
const router = express.Router();



router.use(express.json());




router.use((req, res, next) => {
  console.log('Incoming Request Body:', req.body);
  next();
});



const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req,file,cb)
  {
    cb(null,path.join(__dirname,'../Recieved/image'));
  },
   filename: function(req,file,cb)
   {
    const name = Date.now() +file.originalname;
    cb(null,name)
   }
})


const upload  = multer({storage:storage})

const userController = require('../controllers/userController');


const auth = require('../middlewares/auth');









router.post('/register',upload.single('image'),userController.userRegister)



router.post('/login',userController.loginUser);


//authenticated routes





router.get('/profile',auth,userController.userProfile);




module.exports = router;