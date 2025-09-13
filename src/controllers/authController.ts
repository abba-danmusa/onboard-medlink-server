import { Request, Response } from 'express';
import User from '../models/user';

export const signup = async (req: Request, res: Response) => {
  const { 
    firstName, 
    lastName, 
    email, 
    password, 
    phone,
    country,
    city,
    specialization,
    yearsOfExperience,
    licenseNumber,
    licenseCountry,
    licenseFileUrl,
    profileImageUrl,
    bio,
    languages,
    documents = [],
    availability,
    approved = false
  } = req.body as {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phone?: string;
    country?: string;
    city?: string;
    specialization?: string[];
    yearsOfExperience?: number;
    licenseNumber?: string;
    licenseCountry?: string;
    licenseFileUrl?: string;
    profileImageUrl?: string;
    bio?: string;
    languages?: string[];
    documents?: string[];
    availability?: Array<{day: string, from: string, to: string}>;
    approved?: boolean;
  };
  
  // Required field validation
  if (!firstName || !lastName || !email || !password || !phone || !country || 
      !city || !specialization || !yearsOfExperience || !licenseNumber || 
      !licenseCountry || !licenseFileUrl || !profileImageUrl || !bio || 
      !languages || !availability) {
    return res.status(400).json({ 
      message: 'All required fields must be provided: firstName, lastName, email, password, phone, country, city, specialization, yearsOfExperience, licenseNumber, licenseCountry, licenseFileUrl, profileImageUrl, bio, languages, availability' 
    });
  }
  
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }
    
    const user = new User({ 
      firstName, 
      lastName, 
      email, 
      password,
      phone,
      country,
      city,
      specialization,
      yearsOfExperience,
      licenseNumber,
      licenseCountry,
      licenseFileUrl,
      profileImageUrl,
      bio,
      languages,
      documents,
      availability,
      approved
    });
    
    await user.save();
    const { password: _omit, ...safe } = user.toObject();
    return res.status(201).json({ message: 'User registered successfully.', user: safe });
  } catch (err: any) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required.' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const { password: _omit, ...safe } = user.toObject();
    return res.json({ message: 'Signin successful.', user: safe });
  } catch (err: any) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
