import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Creacion del app
const app = express();

// Conexión a MongoDB usando mongoose

mongoose
	.connect(
		'mongodb+srv://' + 'alex0612' + ':' + 'lnic7Xs7PDd0SyHe' + '@backend.qdsnaiw.mongodb.net/rappi',
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => {
		console.log('Connected.');
	})
	.catch((err) => {
		console.log('There was an error with connection!');
		console.log(err);
	});

// Middlewares
app.use(cors());
app.use(express.json());

import empanadaRoutes from './empanada/empanada.routes.js';
app.use('/empanada', empanadaRoutes);

import usuarioRoutes from './usuario/usuario.routes.js';
app.use('/user', usuarioRoutes);

// Endpoint para 404
app.use((req, res) => {
	res.status(404).json({ message: 'Not founsdabebiia.' });
});

// Inicia app en puerto 8080
app.listen(8080);
