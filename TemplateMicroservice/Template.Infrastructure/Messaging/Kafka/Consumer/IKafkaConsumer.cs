using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Template.Infrastructure.Messaging.Kafka.Consumer
{
    public interface IKafkaConsumer
    {
        Task ConsumeMessage(String topic, String groupId, CancellationToken cancellationToken);

    }
}
