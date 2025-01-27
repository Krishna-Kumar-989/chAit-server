const express = require('express');
const router = express.Router();


const cors = require('cors');

router.use(express.json());
router.use(cors());



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
