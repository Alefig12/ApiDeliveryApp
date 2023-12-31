import usuario from './usuario.model.js';

export async function getUserById(req, res) {
	const { id } = req.params;
	const user = await usuario.findById(id);
	if (!user || user.isDeleted) {
		res.status(404).json({ message: 'User not found' });
		return;
	}
	res.status(200).json(user);
}

export async function loginUser(req, res) {
	const { email, password } = req.body;
	const user = await usuario.findOne({ email, password });
	if (!user || user.isDeleted) {
		res.status(404).json({ message: 'User not found' });
		return;
	}
	res.status(200).json(user);
}

export async function createUser(req, res) {
	try {
		const { name, lastName, email, password, phoneNo, address, isAdmin } = req.body;
		const user = new usuario({ name, lastName, email, password, phoneNo, address, isAdmin });
		const result = await user.save();
		res.status(200).json(result);
	} catch (err) {
		res.status(500).json(err);
	}
}

export async function putUser(req, res) {
	try {
		const { name, lastName, email, password, phoneNo, address, isAdmin, isDeleted } = req.body;
		const userId = req.params.id;
		//also works as "Delete" if you send isDeleted: true
		const user = await usuario.findById(userId);

		if (!user || user.isDeleted) {
			res.status(404).json({ message: 'User not found' });
			return;
		}

		const updatedUser = await usuario.findByIdAndUpdate(userId, {
			name,
			lastName,
			email,
			password,
			phoneNo,
			address,
			isAdmin,
			isDeleted,
		});

		res.status(200).json(updatedUser);
	} catch (err) {
		res.status(500).json(err);
	}
}
