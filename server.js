
const Contact = require('./Models/contactModel');
const Messagemod = require('./Models/messageModel');
const Usrdatamod = require('./Models/userModel');
require("dotenv").config();



const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose'); // Corrected



const app = express();

app.use(cors({
    origin : "*"
}));
app.use(express.json());





const auth = require('./middlewares/auth');

app.use('/homepage',auth);








const userSockets = new Map(); // To map user IDs to socket IDs



const userChatSockets = new Map(); // To map user IDs to socket IDs



const http = require('http');
const server = http.createServer(app);

const io = require('socket.io')(10000,{
    cors:{
      origin : "*",
    },
    connectionStateRecovery: {
      enabled: true, // Enable connection state recovery
      maxDisconnectionDuration: 10000, // Max time (in ms) to allow clients to recover their state (default is 5 seconds)
    }
  })
  
 const socket_auth = require('./middlewares/socketAuth') 


  io.use(socket_auth)
  

  const chat_io = io.of('/chat')

chat_io.use(socket_auth)









const dbUrl = process.env.DATABASE_CONNECTION_STRING;


const port = 3000;

const mongo_url = dbUrl;


mongoose.connect(mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
});








//imports

const userRoute = require('./routes/userRoute');
const applicationRoute = require('./routes/applicationRoute');
const { viewContact } = require('./controllers/contactsController');
const messageModel = require('./Models/messageModel');





//socket implementation
//for
//view contacts and socket registration
io.on("connection", socket => {
    try {
        

  

      // When the client sends their user ID, map it to their socket ID
    socket.on('register', (userId) => {
      userSockets.set(userId, socket.id);
      console.log(`Registered user: ${userId} with socket ID: ${socket.id}`);
  });


        console.log(socket.id);
  
        socket.on('client_data', async (searchquery,contactTo) => {
          
          console.log(searchquery);
          console.log("contact to :" +contactTo)
  
          let query = {};
          if (searchquery) {
            query = {
              $and: [
                {
                  $or: [
                    { username: { $regex: searchquery, $options: 'i' } },
                    { phone: { $regex: searchquery, $options: 'i' } }
                  ]
                },
                { contactTo:contactTo } 
              ]
            };
          }
  
          const contactData = await Contact.find(query);
          console.log(contactData);
          socket.emit('contact_data', contactData);
        });



     




     
    } catch (error) {
      console.error(error);
    }
});




//////////////////////////////////////////////











/////// socket implementation for add contact search

io.on("connection", socket => {
  try {
      



    // When the client sends their user ID, map it to their socket ID
  socket.on('register', (userId) => {
    userSockets.set(userId, socket.id);
    console.log(`Registered user: ${userId} with socket ID: ${socket.id}`);
});


      console.log(socket.id);

      socket.on('add_contact_search', async (searchquery) => {
        console.log(searchquery);

        let query = {};
        if (searchquery) {
          query = {
            $or: [
              { username: { $regex: searchquery, $options: 'i' } },
              { phone: { $regex: searchquery, $options: 'i' } }
            ]
          };
        }

        const usrData = await Usrdatamod.find(query);
        console.log(usrData);
        socket.emit('add_contact_search', usrData);
      });



   




   
  } catch (error) {
    console.error(error);
  }
});














/////add contact search ends































































//socket implementation
//for
//chats

let recipientSocketId ;

let senderSocketId;
///
chat_io.on("connection", socket => {
  try {

        // When the client sends their user ID, map it to their socket ID
    socket.on('register', (userId) => {
      userChatSockets.set(userId, socket.id);
      console.log(`Registered user: ${userId} chat with socket ID: ${socket.id}`);
  





       console.log("chatServersocketDone")
      console.log(socket.id);

       

   





      socket.on('chat_to_server', async (chatDatatoserver) => {
        console.log(chatDatatoserver);

       const recipientSocketId = userChatSockets.get(chatDatatoserver.recipientId);

       const senderSocketId = userChatSockets.get(chatDatatoserver.senderId);

 


       console.log("This is message "+chatDatatoserver.message)

       const conversation = new Messagemod({
        
        messagetype : chatDatatoserver.messagetype,
        message : chatDatatoserver.message,
        sender : chatDatatoserver.senderId,
        reciever : chatDatatoserver.recipientId,
       }
      );


     console.log(conversation)

   const convodata = await conversation.save();










       if (recipientSocketId) {
        chat_io.to(recipientSocketId).emit('chat_to_server', {
            senderId : chatDatatoserver.senderId,
            recipientId : chatDatatoserver.recipientId,
            message: chatDatatoserver.message,
        });


        console.log(`Message sent from ${chatDatatoserver.senderId} with socket id ${senderSocketId} to ${chatDatatoserver.recipientId} and reciepent is ${recipientSocketId}` );
    } else {
        console.log(`User ${chatDatatoserver.recipientId} is not connected`);
    }

    
      });
       

       


  });
        
  
   
  } catch(error) {
    console.error(error);
  }
});



//////////////////////////////////////////////




























































//routes implemtation





app.use('/api', userRoute);





app.use('/application', applicationRoute);

















app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
