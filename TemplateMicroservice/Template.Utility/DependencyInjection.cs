using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

namespace Template.Utility;
public static class DependencyInjection
{
    public static IServiceCollection AddUtilityServices
        (this IServiceCollection services, IConfiguration configuration, ILoggingBuilder loggingBuilder)
    {
        services.AddHealthChecks();
        services.AddLogging(services =>
        {
            services.AddConsole();
            services.AddDebug();
        });

        services.AddOpenTelemetry().ConfigureResource((resource) =>
        {
            var applicationName = configuration["ApplicationName"];
            if (!string.IsNullOrEmpty(applicationName))
            {
                resource.AddService(applicationName);
            }
        }).WithMetrics(metrics =>
        {
            metrics.AddAspNetCoreInstrumentation()
                .AddHttpClientInstrumentation()
                .AddRuntimeInstrumentation()
                .AddOtlpExporter(otlpOptions =>
                {
                    otlpOptions.Endpoint = new Uri(configuration["OtlpEndpoint"]);
                });
        })
        .WithTracing(tracing =>
        {
            tracing.AddAspNetCoreInstrumentation()
            .AddHttpClientInstrumentation()
            .AddGrpcClientInstrumentation()
            .AddOtlpExporter();
        });

        loggingBuilder.AddOpenTelemetry(logging =>
        {
            logging.IncludeFormattedMessage = true;
            logging.IncludeScopes = true;
            logging.AddOtlpExporter();
        });

        return services;
    }
}
