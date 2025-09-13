import { Request, Response } from 'express';
import User from '../models/user';

export const getDashboard = async (req: Request, res: Response) => {
  try {
    // req.user will be set by auth middleware
    const userId = (req as any).user._id;
    
    // Find user and select all fields except password
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data needed for dashboard
    return res.json({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        country: user.country,
        city: user.city,
        specialization: user.specialization,
        yearsOfExperience: user.yearsOfExperience,
        licenseNumber: user.licenseNumber,
        licenseCountry: user.licenseCountry,
        profileImageUrl: user.profileImageUrl,
        bio: user.bio,
        languages: user.languages,
        documents: user.documents,
        availability: user.availability,
        approved: user.approved,
        locale: user.locale,
      }
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};