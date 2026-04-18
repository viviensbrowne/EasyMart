// Vivien Browne
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import Product from './models/Product.js';
import Review from './models/Review.js';
import User from './models/User.js';
import Order from './models/Order.js';

// Query 1: Find all products in the Electronics category.
const query1 = async () => {
	const electronicsProducts = await Product.find({ category: 'Electronics' });
	console.log(`Electronics products found: ${electronicsProducts.length}`);
	electronicsProducts.forEach((product, index) => {
		console.log(`${index + 1}. ${product.name}`);
	});
	console.log('---- End of query1 results ----\n');
};

// Query 2: Find all products with a price greater than $50.
const query2 = async () => {
	const expensiveProducts = await Product.find({ price: { $gt: 50 } });
	console.log(`Products with price greater than $50: ${expensiveProducts.length}`);
	expensiveProducts.forEach((product, index) => {
		console.log(`${index + 1}. ${product.name} - $${product.price}`);
	});
	console.log('---- End of query2 results ----\n');
};

// Query 3: Find all products where isFeatured is true.
const query3 = async () => {
	const featuredProducts = await Product.find({ isFeatured: true });
	console.log(`Featured products found: ${featuredProducts.length}`);
	featuredProducts.forEach((product, index) => {
		console.log(`${index + 1}. ${product.name}`);
	});
	console.log('---- End of query3 results ----');
};

// Query 6: Find all orders that belong to the user Andy Knight.
const query6 = async () => {
	const andy = await User.findOne({ name: 'Andy Knight' });

	if (!andy) {
		console.log('Andy Knight not found.');
		console.log('---- End of query6 results ----');
		return;
	}

	const andyOrders = await Order.find({ user: andy._id });
	console.log(`Orders found for Andy Knight: ${andyOrders.length}`);
	andyOrders.forEach((order, index) => {
		console.log(`${index + 1}. Order ID: ${order._id} | Status: ${order.status}`);
	});
	console.log('---- End of query6 results ----');
};

// Query 14: Find all products that have never received a review.
const query14 = async () => {
	const reviewedProductIds = await Review.distinct('product');
	const neverReviewedProducts = await Product.find({
		_id: { $nin: reviewedProductIds },
	});

	console.log(
		`Products that have never been reviewed: ${neverReviewedProducts.length}`
	);
	neverReviewedProducts.forEach((product, index) => {
		console.log(`${index + 1}. ${product.name}`);
	});
	console.log('---- End of query14 results ----');
};

// Query 15: Increase the stock of the toaster product by 3.
const query15 = async () => {
	const toaster = await Product.findOne({ name: '2 slice toaster' }).select('_id');

	if (!toaster) {
		console.log('Toaster product not found.');
		console.log('---- End of query15 results ----');
		return;
	}

	const updatedToaster = await Product.findByIdAndUpdate(
		toaster._id,
		{ $inc: { stock: 3 } },
		{ returnDocument: 'after' }
	);

	if (!updatedToaster) {
		console.log('Toaster product not found.');
		console.log('---- End of query15 results ----');
		return;
	}

	console.log(
		`Updated toaster stock to: ${updatedToaster.stock} (increased by 3)`
	);
	console.log('---- End of query15 results ----');
};

// Query 16: Find users who have placed more than one order.
const query16 = async () => {
	const groupedOrders = await Order.aggregate([
		{ $group: { _id: '$user', orderCount: { $sum: 1 } } },
		{ $match: { orderCount: { $gt: 1 } } },
	]);

	if (!groupedOrders.length) {
		console.log('No users have more than one order.');
		console.log('---- End of query16 results ----');
		return;
	}

	const userIds = groupedOrders.map((group) => group._id);
	const users = await User.find({ _id: { $in: userIds } }).select('name');
	const nameById = new Map(users.map((user) => [String(user._id), user.name]));

	console.log('Users with more than one order:');
	groupedOrders.forEach((group, index) => {
		const userName = nameById.get(String(group._id)) || String(group._id);
		console.log(`${index + 1}. ${userName} - ${group.orderCount} orders`);
	});
	console.log('---- End of query16 results ----');
};

const runQueries = async () => {
	try {
		await connectDB();
		await query1();
		await query2();
		await query3();
		await query6();
		await query14();
		await query15();
		await query16();
	} catch (error) {
		console.error('Query setup failed:', error.message);
		process.exit(1);
	} finally {
		await mongoose.connection.close();
		console.log('Database connection closed.');
	}
};

runQueries();
