import express from 'express';
import user from '../controller/usercontroller.js';
import authMiddleware from '../middleware/authmiddleware.js';
import path from 'path';

const router = express.Router();

// Register route
router.post('/register', user.register);

// Login route
router.post('/login', user.login);


router.get('/videocall', authMiddleware, (req, res)=>{
    res.sendFile(path.join(__dirname, 'views', 'index.html'));

})


export default router;
