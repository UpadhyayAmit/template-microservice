﻿namespace Template.Domain.Events;

public record OrderUpdatedEvent(Order order) : IDomainEvent;
