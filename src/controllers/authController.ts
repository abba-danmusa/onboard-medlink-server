import { Request, Response } from 'express';
import User from '../models/user';

export const signup = async (req: Request, res: Response) => {
  // extract signup payload
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
    bio,
    languages,
    profileImageUrl,
    // include user's selected locale so backend can store/display localized content
    locale,
    documents = [],
    availability = [{ day: 'mon', from: '09:00', to: '17:00' }],
    approved = false,
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
    bio?: string;
    languages?: string[];
    profileImageUrl?: string;
    locale?: string;
    documents?: string[];
    availability?: Array<{ day: string; from: string; to: string }>;
    approved?: boolean;
  };

  // Required field validation (license/profile file URLs are optional)
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !phone ||
    !country ||
    !city ||
    !specialization ||
    yearsOfExperience === undefined ||
    !licenseNumber ||
    !licenseCountry ||
    !bio ||
    !languages ||
    !availability
  ) {
    return res.status(400).json({
      message:
        'Missing required fields: firstName, lastName, email, password, phone, country, city, specialization, yearsOfExperience, licenseNumber, licenseCountry, bio, languages, availability',
    });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'User with this email already exists' });
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
      profileImageUrl,
      locale,
      bio,
      languages,
      documents,
      availability,
      approved,
    });

    await user.save();

    const safeUser = user.toObject();
    (safeUser as any).password = undefined;

    return res.status(201).json({ user: safeUser });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Internal server error' });
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
