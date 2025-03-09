import User from '../model/usermodel.js';
import jwt from 'jwt-simple';


const secretKey =  'shazaniyuwebcampasss';

// Register route
const register =  async (req:any, res:any) => {
  const { username, email, password } = req.body;
  try {
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Error registering user' });
  }
};

// Login route
const login =  async (req:any, res:any) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const payload = { userId: user._id };
    const token = jwt.encode(payload, secretKey);

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Error logging in' });
  }
};

export default {register, login};
