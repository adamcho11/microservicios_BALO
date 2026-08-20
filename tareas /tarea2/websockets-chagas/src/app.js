const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

// Lineas ganadoras: filas, columnas y diagonales
const lineas = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Revisa si el simbolo gano en alguna linea
function hayGanador(tablero, simbolo) {
    for (let i = 0; i < lineas.length; i = i + 1) {
        const a = lineas[i][0];
        const b = lineas[i][1];
        const c = lineas[i][2];

        if (tablero[a] === simbolo && tablero[b] === simbolo && tablero[c] === simbolo) {
            return true;
        }
    }

    return false;
}

wss.on('connection', ws => {
    const tablero = Array(9).fill(null);
    let terminado = false;

    const enviar = respuesta => ws.send(JSON.stringify({ tablero, ...respuesta }));

    function terminar(resultado, mensaje) {
        terminado = true;
        enviar({ resultado, puedeJugar: false, mensaje });
    }

    enviar({ resultado: 'continua', puedeJugar: true, mensaje: 'Tu turno.' });

    ws.on('message', mensaje => {
        try {
            const datos = JSON.parse(mensaje.toString());
            const posicion = datos.posicion;

            if (terminado) {
                return enviar({ error: 'La partida ya termino.', puedeJugar: false });
            }

            if (!Number.isInteger(posicion) || posicion < 0 || posicion > 8 || tablero[posicion] !== null) {
                return enviar({ error: 'Movimiento no valido.', puedeJugar: true });
            }

            tablero[posicion] = 'X';

            if (hayGanador(tablero, 'X')) {
                return terminar('ganaste', 'Ganaste.');
            }

            if (!tablero.includes(null)) {
                return terminar('empate', 'Empate.');
            }

            // El servidor elige una casilla libre al azar
            let posicionO = Math.floor(Math.random() * 9);
            while (tablero[posicionO] !== null) {
                posicionO = Math.floor(Math.random() * 9);
            }
            tablero[posicionO] = 'O';

            if (hayGanador(tablero, 'O')) {
                return terminar('perdiste', 'Perdiste.');
            }

            if (!tablero.includes(null)) {
                return terminar('empate', 'Empate.');
            }

            enviar({ resultado: 'continua', puedeJugar: true, mensaje: 'Tu turno.' });
        } catch {
            enviar({ error: 'El mensaje no es valido.', puedeJugar: true });
        }
    });
});

console.log('Servidor WebSocket corriendo en ws://localhost:8080');
