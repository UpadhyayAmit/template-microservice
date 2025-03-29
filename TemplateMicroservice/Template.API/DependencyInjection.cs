using Template.Utility.Exceptions.Handler;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Configuration;
using Microsoft.OpenApi.Models;
using Asp.Versioning;
using Template.Infrastructure.Messaging.Kafka.Publisher;
using Template.Infrastructure.Messaging.Kafka.Consumer;
using Template.Utility.Protos;
using Template.Application.GrpcServices;
using Template.Utility;
using Grpc.Net.Client;

namespace Template.API;

public static class DependencyInjection
{
    public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddCors(services =>
        {
            services.AddPolicy("AllowAll", builder =>
            {
                builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });
        });

        services.AddApiVersioning(options =>
        {
            options.ReportApiVersions = true;
            options.AssumeDefaultVersionWhenUnspecified = true;
            options.DefaultApiVersion = new ApiVersion(1, 0);
        });


 

        services.AddControllers();
        services.AddCarter();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "API Title",
                Version = "v1"
            });
        });


        services.AddSingleton<ServiceDiscoveryHelper>();

        //GRPC Client Registration.

        services.AddSingleton<ClientSampleService.ClientSampleServiceClient>(services =>
        {
            var serviceDiscoveryHelper = services.GetRequiredService<ServiceDiscoveryHelper>();
            var channel = GrpcChannel.ForAddress(serviceDiscoveryHelper.ResolveServiceEndpoint("ClientServiceData"));            
            return new ClientSampleService.ClientSampleServiceClient(channel);
        });

        services.AddExceptionHandler<CustomExceptionHandler>();
        services.AddHealthChecks()
            .AddSqlServer(configuration.GetConnectionString("TemplateDB")!);

        return services;
    }

    public static WebApplication UseApiServices(this WebApplication app)
    {
        if (app.Environment.IsDevelopment()) { 
        

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Template API V1");
                c.RoutePrefix=string.Empty; 
            });
        }

        app.UseHttpsRedirection();
        //app.UseAuthentication();
        //app.UseAuthorization(); 

        app.UseRouting();

        app.UseCors("AllowAll");

        app.MapGrpcService<GrpcServerSampleDataService>();

        app.MapCarter();

        app.UseExceptionHandler(options => { });
        app.UseHealthChecks("/health",
            new HealthCheckOptions
            {
                ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse,
                AllowCachingResponses=false
            });

        app.MapHealthChecks("liveness", new HealthCheckOptions
        {
            Predicate = (check) => check.Tags.Contains("liveness"),
            ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
        });

        return app;
    }
}
