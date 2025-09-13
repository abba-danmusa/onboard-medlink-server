import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAvailability {
  day: string;
  from: string;
  to: string;
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  country: string;
  city: string;
  specialization: string[];
  yearsOfExperience: number;
  licenseNumber: string;
  licenseCountry: string;
  licenseFileUrl: string;
  profileImageUrl: string;
  bio: string;
  languages: string[];
  documents: string[];
  availability: IAvailability[];
  approved: boolean;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument> {}

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    specialization: [{ type: String, required: true, trim: true }],
    yearsOfExperience: { type: Number, required: true, min: 0 },
    licenseNumber: { type: String, required: true, trim: true },
    licenseCountry: { type: String, required: true, trim: true },
    licenseFileUrl: { type: String, required: true, trim: true },
    profileImageUrl: { type: String, required: true, trim: true },
    bio: { type: String, required: true, trim: true },
    languages: [{ type: String, required: true, trim: true }],
    documents: [{ type: String, trim: true }],
    availability: [{
      day: { type: String, required: true, trim: true },
      from: { type: String, required: true, trim: true },
      to: { type: String, required: true, trim: true }
    }],
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as any);
  }
});

userSchema.methods.comparePassword = function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: IUserModel = mongoose.model<IUserDocument, IUserModel>('User', userSchema);
export default User;
