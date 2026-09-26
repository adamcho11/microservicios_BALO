using MongoDB.Driver;

public class MongoDbService
{
    private readonly IMongoCollection<Empleado> _collection;

    public MongoDbService()
    {
        var mongoUrl = Environment.GetEnvironmentVariable("MONGO_URL") ?? "mongodb://localhost:27017";
        var client = new MongoClient(mongoUrl);
        var database = client.GetDatabase("empleados_db");
        _collection = database.GetCollection<Empleado>("empleados");
    }

    public List<Empleado> GetAll() => _collection.Find(_ => true).ToList();

    public Empleado? GetById(int id) => _collection.Find(e => e.Id == id).FirstOrDefault();

    public void Insert(Empleado emp) => _collection.InsertOne(emp);

    public long Delete(int id) => _collection.DeleteOne(e => e.Id == id).DeletedCount;

    public int GetMaxId() => _collection.Find(_ => true)
                                         .SortByDescending(e => e.Id)
                                         .FirstOrDefault()?.Id ?? 0;
}
