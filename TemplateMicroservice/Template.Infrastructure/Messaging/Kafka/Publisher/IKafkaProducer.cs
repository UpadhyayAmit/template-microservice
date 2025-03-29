using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Template.Infrastructure.Messaging.Kafka.Publisher
{
    public interface IKafkaProducer
    {
        Task ProduceMessageAsync<T>(T message, string key, int maxRetries = 3);
        Task<String> ProcessLogic();
    }
}
