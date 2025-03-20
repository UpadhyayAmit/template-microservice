namespace Template.Domain.Events;

public record OrderCreatedEvent(Order order) : IDomainEvent;
