import restaurante from './restaurante.model.js';

export async function getRestaurantById(req, res) {
	const { id } = req.params;
	const restaurant = await restaurante.findById(id);
	if (!restaurant || restaurant.isDeleted) {
		res.status(404).json({ message: 'Restaurant not found' });
		return;
	}
	res.status(200).json(restaurant);
}
// /restaurants?category=pizza&name=casa de la
export async function getRestaurants(req, res) {
	const { category, name } = req.query;

	let query = {
		isDeleted: false,
	};

	if (category) {
		query.category = category;
	}

	if (name) {
		const regex = new RegExp(name, 'i');
		query.name = { $regex: regex };
	}

	const restaurants = await restaurante.aggregate([
		{ $match: query },
		{
			$lookup: {
				from: 'pedidos',
				localField: '_id',
				foreignField: 'id_restaurant',
				as: 'pedidos',
			},
		},
		{
			$group: {
				_id: '$_id',
				name: { $first: '$name' },
				category: { $first: '$category' },
				rating: { $sum: { $size: '$pedidos' } },
			},
		},
		{ $sort: { rating: -1 } },
	]);

	if (!restaurants) {
		res.status(404).json({ message: 'Restaurants not found' });
		return;
	}

	res.status(200).json(restaurants);
}

export async function createRestaurant(req, res) {
	try {
		const { name, address, category } = req.body;
		const restaurant = new restaurante({ name, address, category });
		const result = await restaurant.save();
		res.status(200).json(result);
	} catch (err) {
		res.status(500).json(err);
	}
}

export async function updateRestaurant(req, res) {
	try {
		const { id } = req.params;
		const { name, address, category, isDeleted } = req.body;
		const restaurant = await restaurante.findById(id);
		if (!restaurant || restaurant.isDeleted) {
			res.status(404).json({ message: 'Restaurant not found' });
			return;
		}
		restaurant.name = name;
		restaurant.address = address;
		restaurant.category = category;
		restaurant.isDeleted = isDeleted;
		const result = await restaurant.save();
		res.status(200).json(result);
	} catch (err) {
		res.status(500).json(err);
	}
}
