[Back](../README.md)

# API Gateway

API is a set of operations with the aim of offering its consumers a service, product, or an integration.
The consumer (client) of the API does not need to know how the API is implemented.

API Gateway sits between a client and a collection of backend services.
In a microservice architecture, it provides a single point of entry to the API, and redirects the client to the appropriate backend service.

The API Gateway can also be used to authentication, routing, rate limiting, monitoring, logging, distributed tracing, and other common functions that are not specific to one service.

> It is important to take into account that the API Gateway is a single point of failure, since it is the only point of entry to the API.
So, we should guarantee that the API Gateway is running with a high availability.

## Enterprise gateway

Enterprise gateways expose, compose, and manage external and internal APIs. It can be managed via a web interface (portal).
It supports multiple environments (Dev, QA, Prod, etc.).

It can also be used to modernize the architecture of an existing application. Applying patterns like Facade or Strangler Application.

> Enterprise Gateways are usually used as a way to promote a vendor or a cloud service to the public. So they will tend to push you to use  this services. And it can be difficult in the future migrate to a different gateway.
> Some Gateways can offer additional features, such as modifying the payload of a request, and using it to include some kind of business logic can be also an issue if in the future the gateway is changed.

