using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Template.Infrastructure.Messaging.Kafka.Consumer
{
    public class KafkaConsumerBackgroundService : BackgroundService

    {
        private readonly IKafkaConsumer _kafkaConsumer;
        private readonly IConfiguration _configuration;
        private readonly IHostApplicationLifetime _hostApplicationLifetime;
        private readonly ILogger<KafkaConsumerBackgroundService> _logger;
        public KafkaConsumerBackgroundService(IKafkaConsumer kafkaConsumer, ILogger<KafkaConsumerBackgroundService> logger,IConfiguration configuration, IHostApplicationLifetime hostApplicationLifetime)
        {
            _kafkaConsumer = kafkaConsumer;
            _logger = logger;
            _configuration = configuration;
            _hostApplicationLifetime = hostApplicationLifetime;
        }

        public override Task StartAsync(CancellationToken cancellationToken)
        {
            _hostApplicationLifetime.ApplicationStarted.Register(OnStarted);
            _hostApplicationLifetime.ApplicationStarted.Register(OnStopping);
            _hostApplicationLifetime.ApplicationStarted.Register(OnStopped);
            return base.StartAsync(cancellationToken);
        }

        private void OnStarted()
        {
            _logger.LogInformation("OnStarted has been called");
        }

        private void OnStopping()
        {
            _logger.LogInformation("OnStopping has been called");
        }

        private void OnStopped()
        {
            _logger.LogInformation("OnStopped has been called");
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Kafka Consumer Background Service is starting.");

            var topic = _configuration["Kafka:Topic"];
            var groupId = _configuration["Kafka:GroupId"];

            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Kafka Consumer Background Service is running.");
                await _kafkaConsumer.ConsumeMessage(topic, groupId, stoppingToken);
                await Task.Delay(10000, stoppingToken);
            }
            _logger.LogInformation("Kafka Consumer Background Service is stopping.");
        }

        public override Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Kafka Consumer Background Service is stopping.");
            return base.StopAsync(cancellationToken);
        }
    }
}
