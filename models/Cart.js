import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
	{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
			min: 1,
			default: 1,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
	},
	{
		_id: false,
	}
);

// The cart stores a user's in-progress items before checkout creates an order.
const cartSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			unique: true,
		},
		items: {
			type: [cartItemSchema],
            required: false,
			default: [],
		},
		totalPrice: {
			type: Number,
			required: false,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

cartSchema.pre('save', function (next) {
	this.totalPrice = this.items.reduce(
		(total, item) => total + item.price * item.quantity,
		0
	);
	next();
});

export default mongoose.model('Cart', cartSchema);
