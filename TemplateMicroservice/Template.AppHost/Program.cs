var builder = DistributedApplication.CreateBuilder(args);

var connectionString = builder.AddConnectionString("TemplateDB");

builder.AddProject<Projects.Template_API>("template-api").WithReference(connectionString);

var app = builder.Build();
await app.RunAsync();
