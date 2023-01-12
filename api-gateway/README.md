[Back](../README.md)

# API Gateways 

Before we start, let's understand what is an API: API is a set of operations with the aim of offering its consumers a service, product, or an integration.
The consumer (client) of the API does not need to know how the API is implemented.

**API Gateway** sits between a client and a collection of backend services. In a microservice architecture, it provides a **single point of entry to the API**, and redirects the client to the appropriate backend service.
The API Gateway can also be used to authentication, routing, rate limiting, monitoring, logging, distributed tracing, and other common functions that are not specific to one service.

> It is important to take into account that the API Gateway is a single point of failure, since it is the only point of entry to the API.
So, we should guarantee that the API Gateway is running with a high availability.

> API Gateway can be deployed mainly in two different ways, on the edge (PEP - Policy Enforcement Point), or in the middle. Both strategies can also be used at the same time.

## Enterprise gateway

Enterprise gateways expose, compose, and manage external and internal APIs. It can be managed via a web interface (portal).
It supports multiple environments (Dev, QA, Prod, etc.).

It can also be used to modernize the architecture of an existing application. Applying patterns like Facade or Strangler Application.

> Enterprise Gateways are usually used as a way to promote a vendor or a cloud service to the public. So they will tend to push you to use this services. And it can be difficult in the future migrate to a different gateway.
> Some Gateways can offer additional features, such as modifying the payload of a request, and using it to include some kind of business logic can be also an issue if in the future the gateway is changed (vendor lock-in).

In general, Enterprise Gateways need external dependencies, such as databases. Which can reduce the availability of the gateway.

## Microservices gateway

Microservices gateways are used to expose, observe, and monitor APIs (microservices). They are usually used in microservice architectures with the main purpose of routing traffic to the APIs. Usually, they are open source and do not need external dependencies (stateless), which makes them more scalable.
It can be managed via a configuration file (declarative).

In general, they do not support the lifecycle of the APIs.

Some tips:
- Use the flexibility of the deployment to "partition" your APIs (use bounded context from DDD).
- Try to be stateless as much as possible, this will increase the scalability / availability a lot.
- Reduce the number of instances to gain experience in managing the environment. The number of instances can be a problem in teams without expertise in monitoring / observability.
- Too fine granularity can complicate the maintenance of the APIs.
- Automation should be thought from the beginning.

## Kong API Gateway

Kong is an open source API Gateway, can be used as a microservices gateway or as an enterprise gateway, and it's ready to be deployed in Kubernetes, using the Kong Ingress Controller. It is also extensible via plugins (policies), which can be applied globally, per route, or per consumer.

> [Here is an example](https://github.com/dyarleniber/kong-api-gateway-poc/blob/main/k8s/README.md) of Kong API Gateway deployed in Kubernetes, and using custom Typescript plugins.

> Under the hood, Kong uses NGINX, and OpenResty (a Lua framework based on NGINX). This makes it possible to use Lua to write plugins, in fact, most of the plugins available for Kong are written in Lua.

Kong also provides an administration API, which can be used to manage the configuration of the gateway.
It is also possible to use the Konga interface to manage the gateway, Konga is an open source interface for the Kong API Gateway which uses the administrative API of Kong.

### Kong terminology

- **Downstream** (Consumers): a downstream is the application or the client that is consuming the API.
- **Upstream** (Service targets): an upstream is a set of targets (backends) that are used to proxy the incoming HTTP request.

### Kong deployment models

#### DB-Less

In this model, the configuration is stored in a YAML or JSON file. This file is distributed to all Kong nodes.

> It is important to block the administration API, so that it is not possible to make changes to the configuration using the API.
> The configuration file must be in a distributed file system.
> Some plugins are not compatible with this model, or are partially compatible, such as the OAuth2 plugin.

> In general, DB-less deployments are simpler to maintain and require less resources to run. However, [not all plugins are compatible with DB-less operation](https://docs.konghq.com/kubernetes-ingress-controller/latest/references/plugin-compatibility) (Third-party plugins are generally compatible with DB-less).

#### With Database

In this model, the configuration is stored in a database. This database is shared between all Kong nodes, and it is the source of truth.

#### Hybrid

In this model, the configuration is stored in a database, but it is also distributed to all Kong nodes in a YAML or JSON file. This file is used as a cache, and it is updated when the configuration is changed in the database, this way, it is possible to reduce the number of requests to the database.

### Kong + Kubernetes

When using Kong in Kubernetes, the recommended deployment approach is to use the Ingress Controller based configuration along-with DB-less mode.

> No changes to Kubernetes resources are required if migrating from a DB-less deployment to a database-backed deployment, in case needed.

Although Kong Ingress Controller is the recommended approach, Kong is a highly configurable piece of software that can be deployed in a number of different ways, depending on your use-case.
All combinations of various runtimes, databases and configuration methods are supported by [this Helm chart](https://github.com/Kong/charts/tree/main/charts/kong).

> It's not recommended to use the Kong Ingress Controller with a database-backed deployment, but if needed, it is recommended to deploy the database (PostgreSQL) outside of the Kubernetes cluster.

#### Kubernetes Ingress

Kubernetes Ingress is a collection of rules that proxy the traffic from outside the cluster (by exposing HTTP and HTTPS routes) to services within the cluster (using the ClusterIP type for example). These rules are defined inside the Ingress resource of Kubernetes.
So, Kubernetes Ingress acts as an entry point for the cluster.

Kong can be deployed in Kubernetes using the official [Kong Ingress Controller](https://github.com/Kong/kubernetes-ingress-controller). This controller is responsible for translating the Kubernetes Ingress resources into Kong configuration (using the localhost Kong API), which is then used to route and control traffic.

When using Kong Ingress Controller, each Kong pod contains 2 containers (Controller + Data Plane), a controller (container which configures Kong) and a Kong container (which proxies the requests). Scaling out simply requires horizontally scaling this deployment to handle more traffic or to add redundancy in the infrastructure.












!! konghq.com/override: do-not-preserve-host (Might be a problem for 20min, since its using the host info on user service)

!! upstream: host_header = por padrao o ingress do kong vai fazer o load balance pelos ips dos pods
caso queria delegar o modelo de roteamento do kongo para o k8s é preciso incluir a seguinte anotacao na rota
annotations: ingress.kubernetes.io/service-upstream: "true"
e definir do-not-preserve-host e definir host_header: <service_name>.<service_name>.svc (bets.bets.svc)










