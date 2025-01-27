const express = require('express');
const router = express.Router();



router.use(express.json());




router.use((req, res, next) => {
  console.log('Incoming Request Body:', req.body);
  next();
});


const contactsController = require('../controllers/contactsController');


const auth = require('../middlewares/auth');






//authenticated routes





router.post('/addcontact',auth,contactsController.addContact);
router.post('/chat',auth,contactsController.getchats);



module.exports = router;