using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Template.Utility.Protos;

namespace Template.Application.GrpcServices
{
    public class GrpcServerSampleDataService(IApplicationDbContext dbContext, ILogger<GrpcServerSampleDataService> logger)  : ServerSampleService.ServerSampleServiceBase
    {

        public override async Task<ServerSampleResponseList> GetServerSample(ServerSampleRequest request, ServerCallContext context)
        {
            logger.LogInformation("GetServerSample called");

            CancellationToken cancellationToken = context.CancellationToken;
            await Task.Delay(1000, cancellationToken);
            cancellationToken.ThrowIfCancellationRequested();


            var response = new ServerSampleResponseList();

            var mockData = new List<ServerSampleResponse>
            {
                new ServerSampleResponse
                {
                    Id = "1",
                    Name = "Sample Name 1",
                    CreatedAt = Timestamp.FromDateTime(DateTime.UtcNow),
                    UpdatedAt = Timestamp.FromDateTime(DateTime.UtcNow),
                    IsActive = true,
                    StatusCode = 200,
                    Total = 100
                },
                new ServerSampleResponse
                {
                    Id = "2",
                    Name = "Sample Name 2",
                    CreatedAt = Timestamp.FromDateTime(DateTime.UtcNow),
                    UpdatedAt = Timestamp.FromDateTime(DateTime.UtcNow), // convert to UTC DateTime.SpecifyKind(value of datateime, DateTimeKind.Utc)
                    IsActive = false,
                    StatusCode = 404,
                    Total = 200
                }
            };

            response.Items.AddRange(mockData);

            return new ServerSampleResponseList
            {
                Items = { response.Items }
            };

        }

    }
}
