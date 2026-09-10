| Medida | REST (P3) | GraphQL (P4) | gRPC (P5) |
|-------------------------------------|-----------|--------------|-----------|
| Bytes de la respuesta | aprox. 110 | aprox. 125 | aprox. 75 |
| Tiempo promedio observado (ms) | aprox. 6 | aprox. 7 | aprox. 3 |
| Viajes de red del cliente | 1 | 1 | 1 |
| Formato que viaja | texto | texto | binario |
| ¿Se puede leer sin el contrato? | sí | sí | no |
| ¿El navegador lo consume directo? | sí | sí | no |
| Público al que sirve mejor | Aplicaciones web | Clientes que necesitan datos flexibles | Comunicación entre microservicios |