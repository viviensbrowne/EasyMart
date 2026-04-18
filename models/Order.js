import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
	{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
			required: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		image: {
			type: String,
			required: true,
			trim: true,
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

// The order stores the finalized checkout snapshot copied from the user's cart.
const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		// orderItems should be copied from cart.items when checkout creates the order.
		orderItems: {
			type: [orderItemSchema],
			required: true,
		},
		shippingAddress: {
			street: {
				type: String,
				required: true,
				trim: true,
			},
			city: {
				type: String,
				required: true,
				trim: true,
			},
			state: {
				type: String,
				required: true,
				trim: true,
			},
			zipCode: {
				type: String,
				required: true,
				trim: true,
			},
			country: {
				type: String,
				required: true,
				trim: true,
			},
		},
		paymentMethod: {
			type: String,
			required: true,
			enum: ['Credit Card', 'Debit Card', 'PayPal', 'Cash on Delivery'],
		},
		paymentResult: {
			id: {
				type: String,
			},
			status: {
				type: String,
			},
			update_time: {
				type: String,
			},
			email_address: {
				type: String,
			},
		},
		isPaid: {
			type: Boolean,
			required: true,
			default: false,
		},
		paidAt: {
			type: Date,
			required: false,
		},
		isDelivered: {
			type: Boolean,
			required: true,
			default: false,
		},
		deliveredAt: {
			type: Date,
			required: false,
		},
		status: {
			type: String,
			required: false,
			default: 'Pending',
			enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
		},
		taxPrice: {
			type: Number,
			required: true,
			default: 0.0,
		},
		shippingPrice: {
			type: Number,
			required: true,
			default: 0.0,
		},
		totalPrice: {
			type: Number,
			required: true,
			default: 0.0,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model('Order', orderSchema);
