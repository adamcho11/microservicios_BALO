using System.Net.Http.Json;

var builder = WebApplication.CreateBuilder(args);

var productosUrl = Environment.GetEnvironmentVariable("PRODUCTOS_URL") ?? "http://localhost:5001";
builder.Services.AddHttpClient("productos", c => c.BaseAddress = new Uri(productosUrl));

var app = builder.Build();

// obtiene el producto y calcula el total.
app.MapPost("/pedidos", async (CrearPedido peticion, IHttpClientFactory factory) =>
{
    if (peticion.Cantidad <= 0) return Results.BadRequest("cantidad debe ser mayor a cero");

    var http = factory.CreateClient("productos");
    var respuesta = await http.GetAsync($"/productos/{peticion.ProductoId}");
    if (!respuesta.IsSuccessStatusCode) return Results.NotFound();
    
    var producto = await respuesta.Content.ReadFromJsonAsync<ProductoDto>();
    return Results.Ok(Pedidos.Crear(producto!, peticion.Cantidad));
});

app.Run();

public record ProductoDto(int Id, string Nombre, decimal Precio);
public record CrearPedido(int ProductoId, int Cantidad);
public record Pedido(int ProductoId, int Cantidad, decimal Total);

// Logica de negocio (se prueba con la prueba unitaria).
public static class Pedidos
{
    public static Pedido Crear(ProductoDto producto, int cantidad)
    {
        if (producto is null)
            throw new ArgumentNullException(nameof(producto), "El producto es obligatorio");
        if (cantidad <= 0)
            throw new ArgumentOutOfRangeException(nameof(cantidad), "La cantidad debe ser mayor a cero");

        return new Pedido(producto.Id, cantidad, producto.Precio * cantidad);
    }
}

// Clase vacia para que las pruebas localicen este ensamblado.
public class ApiPedido { }
