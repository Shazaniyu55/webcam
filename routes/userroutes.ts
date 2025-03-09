import express from 'express';
import user from '../controller/usercontroller.js';


const router = express.Router();

// Register route
router.post('/register', user.register);

// Login route
router.post('/login', user.login);

export default router;
