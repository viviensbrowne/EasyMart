import mongoose from 'mongoose';


const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Toys', 'Other'],
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    images: {
      type: [String],
      required: false,
    },
    brand: {
      type: String,
      required: false,
      default: '',
    },
    rating: {
      type: Number,
      required: false,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      required: false,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Product', productSchema);
