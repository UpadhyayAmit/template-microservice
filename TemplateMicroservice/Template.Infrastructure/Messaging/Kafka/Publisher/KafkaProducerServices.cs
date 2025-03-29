using Confluent.Kafka;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Template.Infrastructure.Messaging.Kafka.Publisher
{
    public class KafkaProducerServices : IKafkaProducer
    {
        private readonly ILogger<KafkaProducerServices> _logger;
        private readonly string _bootstrapServers;
        private readonly string _sslKeyPassword;
        private readonly IConfiguration _configuration;
        private readonly CancellationTokenSource _cancellationTokenSource = new();

        public KafkaProducerServices(ILogger<KafkaProducerServices> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
            _bootstrapServers = _configuration["Kafka:BootstrapServers"];
            _sslKeyPassword = _configuration["Kafka:SslKeyPassword"];
        }



        public async Task<String> ProcessLogic()
        {
            _logger.LogInformation("ProcessLogic has been called");
            try
            {

                string key = "topic1";
                var item = new
                {
                    Id = 1,
                    Name = "Name1"
                };

                int retryCount = 3;

                await ProduceMessageAsync(item, key, retryCount);
                return await Task.FromResult("ProcessLogic has been called");
            }
            catch (Exception ex)
            {
                _logger.LogError("Error occured: {error}", ex.Message);
                return await Task.FromResult("Error occured");
            }
        }

        private ProducerConfig GetProducerConfig()
        {
            return new ProducerConfig
            {
                BootstrapServers = _bootstrapServers,
                SslCaLocation = GetCertificatePath(),
                SslKeyPassword = _sslKeyPassword,
                SecurityProtocol = SecurityProtocol.Ssl,
                Acks = Acks.All,
                EnableIdempotence = true,
            };
        }

        private string GetCertificatePath()
        {
            string baseDirectory = AppContext.BaseDirectory;
            string certificatePath = Path.Combine(baseDirectory, "cert", "certificate_name.cer");

            if (!File.Exists(certificatePath))
            {
                _logger.LogError("Certificate not found at {certificatePath}", certificatePath);
                throw new FileNotFoundException("Certificate not found", certificatePath);
            }

            return certificatePath;

        }

        public async Task ProduceMessageAsync<T>(T message, string key, int maxRetries = 3)
        {
            _logger.LogInformation("ProduceMessageAsync has been called");


            var producerConfig = GetProducerConfig();
            var messageCount = new Dictionary<string, int>();
            string topicName = getTopicName(key);

            _logger.LogInformation("Producing message to topic: {topicName}", topicName);
            _logger.LogInformation("Message: {message}", message);

            using (var producer = new ProducerBuilder<string, string>(producerConfig).Build())
            {
                for (int i = 0; i < maxRetries; i++)
                {
                    try
                    {
                        var messageString = JsonSerializer.Serialize(message);
                        var deliveryReport = await producer.ProduceAsync(topicName, new Message<string, string> { Key = key, Value = messageString }, _cancellationTokenSource.Token);
                        _logger.LogInformation("Delivered message to: {topicName} [{partition}] @ {offset}", deliveryReport.Topic, deliveryReport.Partition, deliveryReport.Offset);


                        if (deliveryReport.Status == PersistenceStatus.Persisted && !string.IsNullOrEmpty(deliveryReport.Message.Value))
                        {
                            _logger.LogInformation("Produce message to topic: {topicName} success and {Message}", topicName, messageString);

                            if (!messageCount.ContainsKey(topicName))
                            {
                                messageCount.Add(topicName, 1);
                            }
                            else
                            {
                                messageCount[topicName] = messageCount[topicName] + 1;
                            }

                            break;
                        }
                        else if (deliveryReport.Status == PersistenceStatus.NotPersisted)
                        {
                            _logger.LogError("Produce message to topic: {topicName} failed and {Message}", topicName, messageString);
                            messageCount[topicName] = messageCount.ContainsKey(topicName) ? messageCount[topicName] + 1 : 1;
                            _logger.LogInformation("Message retry count: {retryCount}", messageCount[topicName]);

                            await HandleFailedMessage(message, key, maxRetries, messageCount, topicName);
                        }



                        producer.Flush(TimeSpan.FromSeconds(10));
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError("Error occured: {error}", ex.Message);
                        HandleFailedMessage(message, key, maxRetries, messageCount, topicName);
                        break;
                    }
                }

                foreach (var item in messageCount)
                {
                    _logger.LogInformation("Message count for topic: {topicName} is {count}", item.Key, item.Value);
                }
            }

        }

        private async Task HandleFailedMessage<T>(T? message, string key, int maxRetries, Dictionary<string, int> messageCount, string topicName)
        {
            await Task.CompletedTask;
        }

        private string getTopicName(string topicName)
        {
            return topicName switch
            {
                "topic1" => _configuration["Kafka:Topic1"],
                "topic2" => _configuration["Kafka:Topic2"],
                _ => throw new ArgumentException("Invalid topic name")
            };
        }
    }
}
