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
  
    let query = {};
  
    if (category) {
      query.category = category;
    }
  
    if (name) {
      const regex = new RegExp(name, 'i');
      query.name = { $regex: regex };
    }
  
    const restaurants = await restaurante.find(query);
  
    res.status(200).json(restaurants);
  
}