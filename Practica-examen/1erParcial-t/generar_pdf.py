#!/usr/bin/env python3
# Script para generar PDF con todo el codigo del proyecto en letra pequena

from fpdf import FPDF
import os

# Configuracion
CARPETA_PROYECTO = "/Users/adamleanos/Documents/2-2026/microservicios_BALO/Practica-examen/1erParcial-t"
PDF_SALIDA = "/Users/adamleanos/Documents/2-2026/microservicios_BALO/Practica-examen/1erParcial-t/CODIGO_COMPLETO.pdf"

# Archivos a incluir (en orden logico)
ARCHIVOS = [
    "package.json",
    ".env.example",
    ".env",
    "Dockerfile",
    "docker-compose.yml",
    "DOCKER_GUIA.md",
    "models/Trabajador.js",
    "server.js",
    "grpc-ejemplo/trabajador.proto",
    "grpc-ejemplo/grpc-server.js",
    "grpc-ejemplo/grpc-client.js",
    "grpc-ejemplo/README.md",
    "README.md",
]

class PDFCodigo(FPDF):
    def header(self):
        self.set_font("Courier", "B", 8)
        self.cell(0, 5, "1erParcial-t - Codigo Completo del Proyecto", ln=True, align="C")
        self.cell(0, 5, "REST + GraphQL + gRPC con Node.js, Express y MongoDB", ln=True, align="C")
        self.ln(2)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(2)

    def footer(self):
        self.set_y(-10)
        self.set_font("Courier", "I", 6)
        self.cell(0, 5, f"Pagina {self.page_no()}", align="C")

# Crear PDF
pdf = PDFCodigo("P", "mm", "A4")
pdf.set_auto_page_break(auto=True, margin=10)
pdf.add_page()

# Leer e incluir cada archivo
for archivo in ARCHIVOS:
    ruta = os.path.join(CARPETA_PROYECTO, archivo)
    if not os.path.exists(ruta):
        continue

    # Titulo del archivo
    pdf.set_font("Courier", "B", 7)
    pdf.set_fill_color(230, 230, 230)
    pdf.cell(0, 4, f"=== {archivo} ===", ln=True, fill=True)
    pdf.ln(1)

    # Contenido del archivo
    pdf.set_font("Courier", "", 5.5)
    
    with open(ruta, "r", encoding="utf-8", errors="ignore") as f:
        lineas = f.readlines()

    for linea in lineas:
        # Reemplazar tabs por espacios para mejor alineacion
        linea = linea.replace("\t", "    ")
        # Eliminar caracteres que rompan el PDF
        linea_limpia = "".join(c for c in linea if ord(c) < 256 or c in "\n\r")
        
        # Si la linea es muy larga, dividirla
        if len(linea_limpia) > 120:
            partes = [linea_limpia[i:i+120] for i in range(0, len(linea_limpia), 120)]
            for parte in partes:
                pdf.cell(0, 2.5, parte, ln=True)
        else:
            pdf.cell(0, 2.5, linea_limpia.rstrip(), ln=True)

    pdf.ln(2)

# Guardar PDF
pdf.output(PDF_SALIDA)
print(f"PDF generado exitosamente: {PDF_SALIDA}")
print(f"Total de paginas: {pdf.page_no()}")
