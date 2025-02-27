const Contact = require('../Models/contactModel');
const Messagemod = require('../Models/messageModel');



const addContact = async(req,res )=>{
    try{

     const {username , phone ,contactTo,recentmsg,reference} = req.body;
      
     

console.log("dogs"+username)




  const contact =  new Contact({
    username:username,
    phone:phone,
    contactTo : contactTo,
    reference : reference, 
    recentMsg : recentmsg ,
   });



   const contactData = await contact.save();
    
// Respond with success and the created contact data
return res.status(201).json({
  success: true,
  msg: 'Contact added successfully!',
});


    }




    catch(error)
    {
      return res.status(400).json({
        success :false,
        msg :error.message,
      })
    }
   


};










const getchats = async (req, res) => {
  try {
    const { you, me } = req.body;  // Get userId ("you") and contactId ("me") from the request body

    // Check if both userId ("you") and contactId ("me") are provided
    if (!you || !me) {
      return res.status(400).json({ error: 'Both userId ("you") and contactId ("me") are required' });
    }

    // Log the request body for debugging
    console.log('Received input:', req.body);

    // Find all messages between "you" and "me"
    const messages = await Messagemod.find({
      $or: [
        { sender: you, reciever: me },  // "you" as sender and "me" as receiver
        { sender: me, reciever: you }   // "me" as sender and "you" as receiver
      ]
    }).sort({ timestamp: 1 });  // Sort by timestamp (oldest to newest)

    // Log the fetched messages for debugging
    console.log('Messages fetched from DB:', messages);

    // If no messages found
    if (messages.length === 0) {
      return res.status(404).json({ message: 'No messages found between the two users' });
    }

    // Return the messages as the response
    res.json(messages);
    
  } catch (err) {
    console.error('Error during database query:', err);
    res.status(500).json({ error: 'Failed to retrieve chat messages' });
  }
};







module.exports = {addContact,getchats
}

