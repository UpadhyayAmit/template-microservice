using Template.API;
using Template.Application;
using Template.Infrastructure;
using Template.Infrastructure.Data.Extensions;
using Template.Utility;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services
    .AddApplicationServices(builder.Configuration)
    .AddInfrastructureServices(builder.Configuration)
    .AddUtilityServices(builder.Configuration,  builder.Logging)
    .AddApiServices(builder.Configuration);

var app = builder.Build();

app.MapDefaultEndpoints();

// Configure the HTTP request pipeline.
app.UseApiServices();

//if (app.Environment.IsDevelopment())
//{
//    await app.InitialiseDatabaseAsync();
//}

app.Run();
