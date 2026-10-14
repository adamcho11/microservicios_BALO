using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<MongoDbService>();

builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>();

var app = builder.Build();

app.MapGraphQL();

app.Run();
public class Empleado
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Puesto { get; set; } = string.Empty;
    public decimal Salario { get; set; }
}

public class Query(MongoDbService mongo)
{
    public List<Empleado> GetEmpleados() => mongo.GetAll();

    public Empleado? GetEmpleado(int id) => mongo.GetById(id);
}

public class Mutation(MongoDbService mongo)
{

    public Empleado CrearEmpleado(string nombre, string puesto, decimal salario)
    {
        var emp = new Empleado
        {
            Id = mongo.GetMaxId() + 1,
            Nombre = nombre,
            Puesto = puesto,
            Salario = salario
        };
        mongo.Insert(emp);
        return emp;
    }

    public bool EliminarEmpleado(int id) => mongo.Delete(id) > 0;
}
