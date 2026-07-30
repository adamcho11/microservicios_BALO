const express = require("express");
const app = express();
const port = 3000;
//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
    <form method="POST" action="/calcular">
        <label for="num1">numero 1:</label>
        <input type="text" id="num1" name="num1">
        <br>
        <label for="num2">numero 2:</label>
        <input type="text" id="num2" name="num2">
        <br>
        <button type="submit">Calcular</button>
    </form>
    `);
});

app.post('/calcular', (req, res) => {
    const num1 = parseInt(req.body.num1);
    const num2 = parseInt(req.body.num2);
    const suma = num1 + num2;
    res.send(`El resultado de la suma es: ${suma}`);
    });

app.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});
