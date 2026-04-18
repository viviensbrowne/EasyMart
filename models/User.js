import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      required: false,
      default: 'user',
      enum: ['user', 'admin'],
    },
    phone: {
      type: String,
      required: false,
      default: '',
    },
    addresses: {
      type: [
        {
          street: String,
          city: String,
          state: String,
          zipCode: String,
          country: String,
          isDefault: {
            type: Boolean,
            default: false,
          },
        },
      ],
      required: false,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema);
