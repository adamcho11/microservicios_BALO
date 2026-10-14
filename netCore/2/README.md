# Pruebas unitarias y de integración entre 2 microservicios (.NET)

Ejemplo mínimo: **Producto.Api** y **Pedido.Api**, con pruebas **unitarias** y de **integración** (xUnit).

## Arquitectura

```
Pedido.Api  ──HTTP GET /productos/{id}──▶  Producto.Api
(POST /pedidos)                            (lista en memoria)
```

- **Producto.Api**: devuelve un producto por id.
- **Pedido.Api**: recibe `POST /pedidos`, pide el producto y calcula `Total = precio * cantidad`.

## Estructura

```
netCore/2/
├── Producto.Api/Program.cs    # microservicio 1 (REST)
├── Pedido.Api/Program.cs      # microservicio 2 (REST) + lógica Pedidos.Crear
├── Tests/Pruebas.cs           # 7 unitarias (feliz + borde + error) + 1 de integración
├── Producto.Api/Dockerfile    # solo este microservicio se dockeriza
└── Microservicios.slnx
```

## Diferencia clave

- **Unitaria:** prueba `Pedidos.Crear` aislada, **sin HTTP**.
- **Integración:** levanta los **2 servicios** con `WebApplicationFactory` y verifica que Pedido.Api obtiene el precio real de Producto.Api.

## Código

**Producto.Api/Program.cs**

```csharp
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
public class ApiProducto { }   // para que las pruebas encuentren el ensamblado
```

**Pedido.Api/Program.cs**

```csharp
using System.Net.Http.Json;

var builder = WebApplication.CreateBuilder(args);
var productosUrl = Environment.GetEnvironmentVariable("PRODUCTOS_URL") ?? "http://localhost:5001";
builder.Services.AddHttpClient("productos", c => c.BaseAddress = new Uri(productosUrl));

var app = builder.Build();

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

public class ApiPedido { }
```

**Tests/Pruebas.cs**

```csharp
using System.Net.Http.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;

namespace Tests;

public class Pruebas
{
    // UNITARIAS - camino feliz.
    [Fact]
    public void CrearPedido_CalculaElTotal()
    {
        var pedido = Pedidos.Crear(new ProductoDto(1, "Laptop", 1500m), 3);
        Assert.Equal(4500m, pedido.Total);
    }

    // UNITARIAS - casos borde.
    [Fact]
    public void CrearPedido_ConUnaSolaUnidad_UsaElPrecioDirecto()
    {
        var pedido = Pedidos.Crear(new ProductoDto(1, "Mouse", 250m), 1);
        Assert.Equal(250m, pedido.Total);
    }

    [Fact]
    public void CrearPedido_ConProductoGratis_DevuelveTotalCero()
    {
        var pedido = Pedidos.Crear(new ProductoDto(1, "Muestra", 0m), 5);
        Assert.Equal(0m, pedido.Total);
    }

    [Fact]
    public void CrearPedido_ConCantidadGrande_NoDesborda()
    {
        var pedido = Pedidos.Crear(new ProductoDto(1, "Laptop", 15000m), 1_000_000);
        Assert.Equal(15_000_000_000m, pedido.Total);
    }

    // UNITARIAS - casos de error.
    [Fact]
    public void CrearPedido_SinProducto_LanzaExcepcion()
    {
        Assert.Throws<ArgumentNullException>(() => Pedidos.Crear(null!, 1));
    }

    [Fact]
    public void CrearPedido_ConCantidadCero_LanzaExcepcion()
    {
        Assert.Throws<ArgumentOutOfRangeException>(
            () => Pedidos.Crear(new ProductoDto(1, "Laptop", 1500m), 0));
    }

    [Fact]
    public void CrearPedido_ConCantidadNegativa_LanzaExcepcion()
    {
        Assert.Throws<ArgumentOutOfRangeException>(
            () => Pedidos.Crear(new ProductoDto(1, "Laptop", 1500m), -1));
    }

    // INTEGRACIÓN: Pedido.Api llama de verdad a Producto.Api.
    [Fact]
    public async Task Pedido_UsaElPrecioDeProductoApi()
    {
        var productoFactory = new WebApplicationFactory<ApiProducto>();

        using var pedidoFactory = new WebApplicationFactory<ApiPedido>()
            .WithWebHostBuilder(b => b.ConfigureServices(servicios =>
                servicios.AddHttpClient("productos", c => c.BaseAddress = new Uri("http://producto"))
                         .ConfigurePrimaryHttpMessageHandler(() => productoFactory.Server.CreateHandler())));

        var respuesta = await pedidoFactory.CreateClient()
            .PostAsJsonAsync("/pedidos", new CrearPedido(1, 3));

        respuesta.EnsureSuccessStatusCode();
        var pedido = await respuesta.Content.ReadFromJsonAsync<Pedido>();
        Assert.Equal(45000m, pedido!.Total);
    }
}
```

## Cómo ejecutar

```bash
dotnet test                              # 8 pruebas en verde
dotnet run --project Producto.Api        # http://localhost:5001
dotnet run --project Pedido.Api          # http://localhost:5002
docker build -t producto-api ./Producto.Api
```

## Cobertura

El proyecto usa **coverlet**. Se activa con:

```bash
dotnet test /p:CollectCoverage=true
```

Imprime una tabla y genera `Tests/coverage/coverage.cobertura.xml`:

```
| Module       | Line | Branch | Method |
| Pedido.Api   | 100% | 70%    | 100%   |
| Producto.Api | 100% | 50%    | 100%   |
| Total        | 100% | 66.66% | 100%   |
```

El umbral está en `Tests.csproj` (`Threshold=90`, sobre líneas). Si la cobertura
baja de ese valor, **la suite falla** y el comando devuelve un código de salida distinto de 0.

```xml
<Threshold>90</Threshold>
<ThresholdType>line</ThresholdType>
<ThresholdStat>total</ThresholdStat>
```


## Ideas para diapositivas

1. Título: pruebas unitarias vs integración en .NET.
2. Diagrama de los 2 microservicios.
3. Diferencia: unitaria (aislada, sin HTTP) vs integración (2 servicios, HTTP real).
4. `Pedido.Api` consumiendo a `Producto.Api`.
5. Prueba unitaria: lógica pura.
6. Prueba de integración: `WebApplicationFactory` + `TestServer`.
7. Demo: `dotnet test`.
