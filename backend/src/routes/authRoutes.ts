import express from 'express';
import { loginUser } from '../service/authService';



const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password} = req.body;
  try {
    const token = await loginUser(email,password );
    res.json({ token });
  } catch (err:any) {
    res.status(401).json({ message: err.message });
  }
});

export default router;
