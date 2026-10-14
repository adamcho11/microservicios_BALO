using Empleado.Grpc.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddGrpc();
builder.Services.AddGrpcReflection(); 

var app = builder.Build();


app.MapGrpcService<EmpleadoServiceImpl>();
app.MapGrpcReflectionService(); 

app.Run();
