using Grpc.Core;
using Empleado.Grpc;

namespace Empleado.Grpc.Services;

public class EmpleadoServiceImpl : EmpleadoService.EmpleadoServiceBase
{
    private static readonly List<Empleado> Empleados = new()
    {
        new() { Id = 1, Nombre = "Juan Perez", Puesto = "Desarrollador", Salario = 50000 },
        new() { Id = 2, Nombre = "Maria Garcia", Puesto = "Disenadora", Salario = 45000 }
    };



    public override Task<Empleado> ObtenerEmpleado(EmpleadoId request, ServerCallContext context)
    {
        var emp = Empleados.FirstOrDefault(e => e.Id == request.Id);
        return Task.FromResult(emp ?? new Empleado());
    }


    public override Task<EmpleadoList> ListarEmpleados(Empty request, ServerCallContext context)
    {
        var lista = new EmpleadoList();
        lista.Empleados.AddRange(Empleados);
        return Task.FromResult(lista);
    }
}
