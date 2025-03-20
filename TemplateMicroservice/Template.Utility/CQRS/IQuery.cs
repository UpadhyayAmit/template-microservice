using MediatR;

namespace Template.Utility.CQRS;

public interface IQuery<out TResponse> : IRequest<TResponse>
    where TResponse : notnull { }
