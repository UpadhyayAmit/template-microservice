using Confluent.Kafka;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Template.Infrastructure.Messaging.Kafka.Consumer
{
    public class KafkaConsumerService : IKafkaConsumer
    {
        private readonly ILogger<KafkaConsumerService> _logger;
        private readonly IConfiguration _configuration;

        public KafkaConsumerService(ILogger<KafkaConsumerService> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        public async Task ConsumeMessage(string topic, string groupId, CancellationToken stoppingtoken)
        {
            _logger.LogInformation("Kafka Consumer Service is starting - Topic {topic} with GroupId {groupId}.", topic, groupId);

            var consumerConfig = new ConsumerConfig
            {
                BootstrapServers = _configuration["Kafka:BootstrapServers"],
                SaslUsername = _configuration["Kafka:SaslUsername"], // check before use
                SaslPassword = _configuration["Kafka:SaslPassword"],
                SslKeyLocation = _configuration["Kafka:SslKeyLocation"],// check before use
                SslCaLocation = GetCertificatePath(),// check before use
                EnableAutoCommit = true,
                AutoOffsetReset = AutoOffsetReset.Earliest,
                ClientId = "id-of-app",
                AutoCommitIntervalMs = 5000,
                GroupId = groupId,
                SecurityProtocol = SecurityProtocol.Ssl,


            };

            using (var consumer = new ConsumerBuilder<string, string>(consumerConfig).Build())
            {
                consumer.Subscribe(topic);
                try
                {
                    while (!stoppingtoken.IsCancellationRequested)
                    {
                        try
                        {
                            var consumeResult = consumer.Consume(stoppingtoken);

                            if (consumeResult.IsPartitionEOF)
                            {
                                _logger.LogInformation("Reached end of topic {topic}", consumeResult.Topic);
                                continue;
                            }

                            if (consumeResult.Message.Value == "exit")
                            {
                                _logger.LogInformation("Exit message received. Exiting consumer.");
                                break;
                            }

                            if (consumeResult.Message.Value == "error")
                            {
                                _logger.LogError("Error message received. Exiting consumer.");
                                break;
                            }

                            if (consumeResult.Message.Value == "exception")
                            {
                                throw new Exception("Exception message received. Exiting consumer.");
                            }

                            if (consumeResult.Message == null)
                            {
                                _logger.LogError("No Data avaialble to consume.");
                                continue;
                            }
                            _logger.LogInformation("Consumed message '{message}' at: '{topic}' with offset: '{offset}'", consumeResult.Message.Value, consumeResult.Topic, consumeResult.Offset);

                            await ProcessMessageAsync(consumeResult.Message);

                            consumer.Commit(consumeResult);
                            await Task.Delay(1000, stoppingtoken);

                        }
                        catch (ConsumeException e)
                        {
                            _logger.LogError("Error occured: {error}", e.Error.Reason);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError("Error occured: {error}", ex.Message);
                        }
                    }
                }
                catch (OperationCanceledException)
                {
                    _logger.LogInformation("Kafka Consumer Service is stopping.");
                    consumer.Close();
                }
                finally
                {
                    consumer.Close();
                    consumer.Dispose();
                    _logger.LogInformation("Consumer Closed and Disposed.");
                }

            }


        }

        private async Task ProcessMessageAsync(Message<string, string> message)
        {
            _logger.LogInformation("Processing key '{Key}' at: '{Value}' with : '{Value}'", message.Key, message.Value);
        }

        private string GetCertificatePath()
        {
            string baseDirectory = AppContext.BaseDirectory;
            string certificatePath = Path.Combine(baseDirectory, "cert", "certificate-name.cer");
            if (!File.Exists(certificatePath))
            {
                throw new FileNotFoundException("Certificate file not found", certificatePath);
            }

            return certificatePath;
        }
    }
}
