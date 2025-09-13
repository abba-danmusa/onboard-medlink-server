const User = require('../models/user');

exports.signup = async (req, res) => {
  const { firstName, lastName, email, password, profileImageUrl } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'firstName, lastName, email, and password are required.' });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }
    const user = new User({ firstName, lastName, email, password, profileImageUrl });
    await user.save();
    const { password: _, ...safe } = user.toObject();
    res.status(201).json({ message: 'User registered successfully.', user: safe });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const { password: _, ...safe } = user.toObject();
    res.json({ message: 'Signin successful.', user: safe });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
