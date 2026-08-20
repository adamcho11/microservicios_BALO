const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const combinacionesGanadoras = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function hayGanador(tablero,simbolo){
    return combinacionesGanadoras.some(([a,b,c]) =>{
        return (tablero[a] === simbolo && tablero[b] === simbolo && tablero[c] === simbolo);
    });
}
function obtenerCasillasLibres(tablero) {
    return tablero
        .map((casilla, indice) => {
            return casilla === null ? indice : null;
        })
        .filter((indice) => indice !== null);
}

function enviarEstado(ws, tablero, resultado, puedeJugar, mensaje) {
    ws.send(JSON.stringify({
        tablero,
        resultado,
        puedeJugar,
        mensaje
    }));
}

function enviarError(ws, tablero, mensaje, puedeJugar = true) {
    ws.send(JSON.stringify({
        error: mensaje,
        tablero,
        puedeJugar
    }));
}

wss.on('connection', (ws) => {
    console.log('Cliente conectado.');
    const tablero = Array(9).fill(null);
    let juegoTerminado = false;

    ws.on('message', (message) => {
        try {
            const datos = JSON.parse(message.toString());
            const posicion = datos.posicion;

            if (juegoTerminado) {
                enviarError(ws, tablero, 'La partida ya termino.', false);
                return;
            }

            if (
                !Number.isInteger(posicion) ||
                posicion < 0 ||
                posicion > 8
            ) {
                enviarError(ws, tablero, 'La posicion no es valida.');
                return;
            }

            if (tablero[posicion] !== null) {
                enviarError(ws, tablero, 'Esa casilla ya esta ocupada.');
                return;
            }

            tablero[posicion] = 'X';

            if (hayGanador(tablero, 'X')) {
                juegoTerminado = true;

                enviarEstado(
                    ws,
                    tablero,
                    'ganaste',
                    false,
                    'Ganaste.'
                );

                return;
            }

            let casillasLibres = obtenerCasillasLibres(tablero);

            if (casillasLibres.length === 0) {
                juegoTerminado = true;

                enviarEstado(
                    ws,
                    tablero,
                    'empate',
                    false,
                    'Empate.'
                );

                return;
            }

            const indiceAleatorio = Math.floor(
                Math.random() * casillasLibres.length
            );

            const posicionServidor = casillasLibres[indiceAleatorio];

            tablero[posicionServidor] = 'O';

            if (hayGanador(tablero, 'O')) {
                juegoTerminado = true;

                enviarEstado(
                    ws,
                    tablero,
                    'perdiste',
                    false,
                    'Perdiste.'
                );

                return;
            }

            casillasLibres = obtenerCasillasLibres(tablero);

            if (casillasLibres.length === 0) {
                juegoTerminado = true;

                enviarEstado(
                    ws,
                    tablero,
                    'empate',
                    false,
                    'Empate.'
                );

                return;
            }

            enviarEstado(
                ws,
                tablero,
                'continua',
                true,
                'Tu turno.'
            );
        } catch (error) {
            enviarError(ws, tablero, 'El mensaje no es valido.');
        }
    });

    ws.on('close', () => {
        console.log('Cliente desconectado.');
    });
    enviarEstado(
        ws,
        tablero,
        'continua',
        true,
        'Tu turno.'
    );
});

console.log('Servidor WebSocket corriendo en ws://localhost:8080');