import { Request, Response } from 'express';
import User from '../models/user';
import mongoose from 'mongoose';

// Type for editable user fields
interface EditableUserFields {
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  city?: string;
  specialization?: string[];
  yearsOfExperience?: number;
  licenseNumber?: string;
  licenseCountry?: string;
  profileImageUrl?: string;
  bio?: string;
  languages?: string[];
  documents?: string[];
  availability?: Array<{
    day: string;
    from: string;
    to: string;
  }>;
  locale?: string;
}

interface AvailabilitySlot {
  day: string;
  from: string;
  to: string;
}

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

export const editUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    // Verify userId is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // Ensure user can only edit their own data
    const authUserId = (req as any).user._id.toString();
    if (authUserId !== userId) {
      return res.status(403).json({ message: 'Not authorized to edit this user' });
    }

    // Fields that can be updated
    const allowedUpdates = [
      'firstName',
      'lastName',
      'phone',
      'country',
      'city',
      'specialization',
      'yearsOfExperience',
      'licenseNumber',
      'licenseCountry',
      'profileImageUrl',
      'bio',
      'languages',
      'documents',
      'availability',
      'locale'
    ];

    // Filter out any fields that aren't in allowedUpdates
    const updates = Object.keys(req.body).reduce((acc: any, key) => {
      if (allowedUpdates.includes(key)) {
        acc[key] = req.body[key];
      }
      return acc;
    }, {}) as EditableUserFields;

    // If no valid updates provided
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid update fields provided' });
    }

    // Validate specific fields if they're being updated
    if (updates.availability) {
      const isValidAvailability = updates.availability.every((slot: AvailabilitySlot) =>
        slot.day && slot.from && slot.to &&
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(slot.from) &&
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(slot.to)
      );
      if (!isValidAvailability) {
        return res.status(400).json({ 
          message: 'Invalid availability format. Each slot must have day, from, and to (HH:MM format)' 
        });
      }
    }

    // Find and update the user
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { 
        new: true, // Return updated user
        runValidators: true, // Run schema validators
        select: '-password' // Don't return password
      }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ 
      message: 'User updated successfully',
      user
    });
  } catch (err) {
    console.error('User edit error:', err);
    return res.status(500).json({ 
      message: 'Error updating user',
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
};