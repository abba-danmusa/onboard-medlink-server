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
  phone?: string;
  country?: string;
  city?: string;
  specialization?: string[];
  yearsOfExperience?: number;
  licenseNumber?: string;
  licenseCountry?: string;
  licenseFileUrl?: string;
  profileImageUrl?: string;
  locale?: string;
  bio?: string;
  languages?: string[];
  documents?: string[];
  availability?: IAvailability[];
  approved?: boolean;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument> {}

const availabilitySlotSchema = new mongoose.Schema<IAvailability>({
  day: { type: String, required: true, trim: true },
  from: { type: String, required: true, trim: true },
  to: { type: String, required: true, trim: true },
});

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, trim: true },
    country: { type: String, trim: true },
    city: { type: String, trim: true },
    specialization: { type: [String], default: [] },
    yearsOfExperience: { type: Number, min: 0 },
    licenseNumber: { type: String, trim: true },
    licenseCountry: { type: String, trim: true },
    licenseFileUrl: { type: String, trim: true },
    profileImageUrl: { type: String, trim: true },
    locale: { type: String },
    bio: { type: String, trim: true },
    languages: { type: [String], default: [] },
    documents: { type: [String], default: [] },
    availability: { type: [availabilitySlotSchema], default: [{ day: 'mon', from: '09:00', to: '17:00' }] },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre<IUserDocument>('save', async function (next) {
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
