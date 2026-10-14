var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var productos = new List<Producto>
{
    new(1, "Laptop", 15000m),
    new(2, "Mouse", 250m)
};

app.MapGet("/productos/{id:int}", (int id) =>
    productos.FirstOrDefault(p => p.Id == id) is { } producto
        ? Results.Ok(producto)
        : Results.NotFound());

app.Run();

public record Producto(int Id, string Nombre, decimal Precio);

public class ApiProducto { }
