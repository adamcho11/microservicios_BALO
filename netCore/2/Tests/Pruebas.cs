    using System.Net.Http.Json;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Mvc.Testing;
    using Microsoft.Extensions.DependencyInjection;

    namespace Tests;

    public class Pruebas
    {
        [Fact]
        public void CrearPedido_CalculaElTotal()
        {
            var pedido = Pedidos.Crear(new ProductoDto(1, "Laptop", 1500m), 2);
            Assert.Equal(4500m, pedido.Total);
        }

        // Casos borde.
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

        // Casos de error.
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



        // prueba de intregracion

        // Pedido.Api a Producto.Api.
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
