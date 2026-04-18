import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    productRef: {
      type: Number,
      required: true,
      min: 0,
      max: 9,
    },
    userRef: {
      type: Number,
      required: true,
      min: 0,
      max: 4,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ productRef: 1, userRef: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
