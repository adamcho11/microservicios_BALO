using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var mongoClient = new MongoClient("mongodb://localhost:27017");
var database = mongoClient.GetDatabase("empleados_db");
var collection = database.GetCollection<Empleado>("empleados");

if (collection.CountDocuments(_ => true) == 0)
{
    collection.InsertMany(new List<Empleado>
    {
        new() { Id = 1, Nombre = "Juan Perez", Puesto = "Desarrollador", Salario = 50000 },
        new() { Id = 2, Nombre = "Maria Garcia", Puesto = "Disenadora", Salario = 45000 }
    });
}

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/empleados", () => collection.Find(_ => true).ToList());

app.MapGet("/empleados/{id}", (int id) =>
{
    var emp = collection.Find(e => e.Id == id).FirstOrDefault();
    return emp is null ? Results.NotFound() : Results.Ok(emp);
});

app.MapPost("/empleados", (Empleado emp) =>
{
    var maxId = collection.Find(_ => true)
                          .SortByDescending(e => e.Id)
                          .FirstOrDefault()?.Id ?? 0;
    emp.Id = maxId + 1;
    
    collection.InsertOne(emp);
    return Results.Created($"/empleados/{emp.Id}", emp);
});

app.MapPut("/empleados/{id}", (int id, Empleado emp) =>
{
    var existe = collection.Find(e => e.Id == id).FirstOrDefault();
    if (existe is null) return Results.NotFound();
    
    emp.Id = id; // Nos aseguramos que el ID no cambie
    collection.ReplaceOne(e => e.Id == id, emp);
    return Results.NoContent();
});

app.MapDelete("/empleados/{id}", (int id) =>
{
    var result = collection.DeleteOne(e => e.Id == id);
    return result.DeletedCount == 0 ? Results.NotFound() : Results.NoContent();
});

app.Run();

public class Empleado
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Puesto { get; set; } = string.Empty;
    public decimal Salario { get; set; }
}
