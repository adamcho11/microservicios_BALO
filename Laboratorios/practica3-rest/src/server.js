require("dotenv").config();
const app = require("./app");
const { conectar } = require("./repositorio");
const port = process.env.PORT || 3000;

conectar()
	.then(() => app.listen(port))
	.catch((err) => {
		console.error("No se pudo conectar a MongoDB", err);
		process.exitCode = 1;
	});
