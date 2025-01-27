
const User = require('../Models/userModel');
const bcrypt = require('bcrypt');


const jwt = require('jsonwebtoken');





const userRegister = async(req,res )=>{
    try{




     const {username , phone , password } = req.body;

    
      
     const isExists = await User.findOne({phone});

       if(isExists)
       {
        return res.status(400).json({
          success :false,
          msg : "phone already exist",
        })
       }





   const hashpassword =  await  bcrypt.hash(password,10);


  const user =  new User({
    username:username,
    phone:phone,
    password:hashpassword,
    //image : 'image/ '+req.file.filename
   });





   const userData = await user.save();
    
   return res.status(200).json({
    success:true,
    msg : 'Registered Succesfully! continue to login',
    user : userData
   })


    }




    catch(error)
    {
      return res.status(400).json({
        success :false,
        msg :error.message,
      })
    }
   


};


const genrateAccessToken = async(user) => {

const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn : "2h"});

return token;

}


const genrateRefreshToken = async(user) => {

  const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn : "6h"} );
  
  return token;
  
  }
















const loginUser = async(req,res) =>
{
    try{

          const {phone ,password} = req.body;
          
          const userData = await  User.findOne({phone});
          console .log(phone)
          console.log(userData)
          

          if(!userData)
          {
            return res.status(400).json({
              success: false,
              msg: 'Email or pssword is incorrect'
            })
          }

         
        const passwordMatch = await bcrypt.compare(password,userData.password);

    

         if(!passwordMatch)
         {
          return res.status(400).json({
            success: false,
            msg: 'Email or pssword is incorrect'
          }) 
         }



         const accessToken = await genrateAccessToken({user: userData});
         
         return res.status(200).json({
          success :true,
          msg :'Login Success!',
          user: userData,
          accessToken : accessToken,
          tokenType : 'Bearer'
         });



    }

    catch(error)
    {
      return res.status(400).json({
        success :false,
        msg :error.message,
      })
    }


}




const userProfile = async(req,res) => {


  try{
      
    const userData = req.user.user ;
      

       return res.status(200).json({
       success : true,
       msg: 'User Profile Data',
       data : userData

       });







  }

    catch(error)
    {
      return res.status(400).json({
        success :false,
        msg :error.message,
      })
    }


} 




















module.exports = {userRegister,
  loginUser ,userProfile
}