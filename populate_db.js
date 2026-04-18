import { connectDB } from './db.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Review from './models/Review.js';
import Order from './models/Order.js';
import Cart from './models/Cart.js';

import userData from './data/user.json' with { type: 'json' };
import productData from './data/products.json' with { type: 'json' };
import reviewData from './data/reviews.json' with { type: 'json' };
import orderData from './data/orders.json' with { type: 'json' };

const populateDB = async () => {
	await connectDB();

	try {
		// Clear existing data
		await User.deleteMany({});
		await Product.deleteMany({});
		await Review.deleteMany({});
		await Order.deleteMany({});
		await Cart.deleteMany({});
		console.log('Cleared all existing data');

		// Insert users
		const insertedUsers = await User.insertMany(userData);
		console.log(`Inserted ${insertedUsers.length} users`);

		// Insert products
		const insertedProducts = await Product.insertMany(productData);
		console.log(`Inserted ${insertedProducts.length} products`);

		// Map reviews: replace productRef/userRef indices with real ObjectIds
		const mappedReviews = reviewData.map((review) => ({
			...review,
			product: insertedProducts[review.productRef]._id,
			user: insertedUsers[review.userRef]._id,
		}));
		const insertedReviews = await Review.insertMany(mappedReviews);
		console.log(`Inserted ${insertedReviews.length} reviews`);

		// Map orders: replace userRef/productRef indices with real ObjectIds
		const mappedOrders = orderData.map((order) => ({
			...order,
			user: insertedUsers[order.userRef]._id,
			orderItems: order.orderItems.map((item) => ({
				...item,
				product: insertedProducts[item.productRef]._id,
			})),
		}));
		const insertedOrders = await Order.insertMany(mappedOrders);
		console.log(`Inserted ${insertedOrders.length} orders`);

		const totalOrderItems = insertedOrders.reduce(
			(total, order) => total + order.orderItems.length,
			0
		);
		const featuredProducts = insertedProducts.filter(
			(product) => product.isFeatured
		).length;
		const paidOrders = insertedOrders.filter((order) => order.isPaid).length;
		const deliveredOrders = insertedOrders.filter(
			(order) => order.isDelivered
		).length;
		const averageProductRating = insertedProducts.length
			? (
					insertedProducts.reduce((total, product) => total + product.rating, 0) /
					insertedProducts.length
			  ).toFixed(2)
			: '0.00';

		console.log('Database populated successfully!');
		console.log('Summary statistics:');
		console.log(`- Users: ${insertedUsers.length}`);
		console.log(`- Products: ${insertedProducts.length}`);
		console.log(`- Featured products: ${featuredProducts}`);
		console.log(`- Reviews: ${insertedReviews.length}`);
		console.log(`- Orders: ${insertedOrders.length}`);
		console.log(`- Total order items: ${totalOrderItems}`);
		console.log(`- Paid orders: ${paidOrders}`);
		console.log(`- Delivered orders: ${deliveredOrders}`);
		console.log(`- Average product rating: ${averageProductRating}`);
		process.exit(0);
	} catch (error) {
		console.error('Error populating database:', error.message);
		process.exit(1);
	}
};

populateDB();
