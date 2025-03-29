using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Template.Infrastructure.Messaging.Kafka.Publisher
{
    public class KafkaProducerBackgroundService : BackgroundService
    {
        private readonly ILogger<KafkaProducerBackgroundService> _logger;
        private readonly IKafkaProducer _kafkaProducer;
        private readonly IHostApplicationLifetime _hostApplicationLifetime;

        public KafkaProducerBackgroundService(ILogger<KafkaProducerBackgroundService> logger, IKafkaProducer kafkaProducer, IHostApplicationLifetime hostApplicationLifetime)
        {
            _logger = logger;
            _kafkaProducer = kafkaProducer;
            _hostApplicationLifetime = hostApplicationLifetime;
        }

        public override Task StartAsync(CancellationToken cancellationToken)
        {
            _hostApplicationLifetime.ApplicationStarted.Register(OnStarted);
            _hostApplicationLifetime.ApplicationStopping.Register(OnStopping);
            _hostApplicationLifetime.ApplicationStopped.Register(OnStopped);
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
            _logger.LogInformation("Kafka Producer Background Service is starting.");
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Kafka Producer Background Service is running.");
                await _kafkaProducer.ProcessLogic();
                await Task.Delay(1000, stoppingToken);
            }
        }

        public override Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Kafka Producer Background Service is stopping.");
            return base.StopAsync(cancellationToken);
        }
    }
}
