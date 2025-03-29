using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Template.Utility
{
    public class ServiceDiscoveryHelper
    {
        private readonly IConfiguration _configuration;

        public ServiceDiscoveryHelper(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string ResolveServiceEndpoint(string serviceName)
        {
            var serviceConfig = _configuration.GetSection($"ServiceDiscovery:Services:{serviceName}");
            if (serviceConfig == null)
            {
                throw new Exception($"Service {serviceName} not found in ServiceDiscovery configuration");
            }

            var endpoint = serviceConfig.GetSection("Endpoints").GetChildren().FirstOrDefault();
            if (endpoint == null)
            {
                throw new Exception($"Service {serviceName} does not have any endpoints configured");
            }

            return endpoint.GetValue<string>("Url");
        }
    }
}
