const jwt = require('jsonwebtoken')


const config = process.env;





const verifyToken  = (socket,next) => {

const token = socket.handshake.query.token;

 if(!token){
  
  return next(new Error('Authentication error'));;

  

 }


   try{

        const bearer = token.split(' ');
        const bearerToken = bearer[1];

        const decodedData = jwt.verify(token,config.ACCESS_TOKEN_SECRET);

       
       socket.user = decodedData;




   }
   catch(error)
   {
    return next(new Error('Authentication error'));
   

   }


   return next();


}


module.exports = verifyToken