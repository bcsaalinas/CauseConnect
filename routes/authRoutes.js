import express from 'express';
const router = express.Router();

// Mock database
const users = [];

// Login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        res.status(200).json({ message: 'Login successful', user });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Signup route
router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    const userExists = users.some(u => u.email === email);

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
    } else {
        const newUser = { name, email, password };
        users.push(newUser);
        res.status(201).json({ message: 'Signup successful', user: newUser });
    }
});

export default router;