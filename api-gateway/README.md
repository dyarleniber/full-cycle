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



API Gateway

API = Conjunto de recursos utilizados para abstrair funcionalidades

API Gateway = Single entry point
Ferramente adicionada entre os micro servicos e o cliente, atuando como unico ponto de entrada das APIs
E redirecionando as requisicoes para os servicos
Single point of failure = infraestrutura deve garantir uma alta disponibilidade e resiliencia

Funcionalidades

Atua na camada de rede provendo funcionalidades ortogonais, que nao sao necessariamente responsabilidade das aplicacoes
Ex:

- Rate limiting
- Autenticacao / Autorizacao
- Logs
- Routing
- Metricas padronizadas (400, 500 etc)
- Tracing distribuido (identificar caminho das requisicoes)

Tipos de API Gateway

Enterprise Gateway - Exposicao e gerenciamento de deployment de APIS
Tambem permite controlar o ciclo de vida de uma API

Em geral é uma oferta de algum vendor com estrategias comerciais suportando a solucao.

- Importante - Como sao suportadas diversas funcionalidades, como por exemplo a alteracao dos payloads, o uso dessse tipo de gateway tende a direcionar a aplicacao da solucao e implicar no design dos servicos.
  Dificultando inclusive a migracao para outros Gateways.

Proposito principal
Exposicao, composicao e gerenciamento de APIs externas e internas

Manutencao das APIS
time de APIs em geral faz administracao via Portal do API Gateway

Suporte a ambientes
Suporta multiplos ambientes DEV, QA e Prod

Disponibilidade vs Consistencia
Ao implementar um rate limit usando redis por exemplo podemos ter uma menor disponibilidade por exemplo
Em geral Enterprise gateways precisam d dependencias externas

Cuidado com utilizacao de policies da propria ferramente (vendor lock-in!)

Microservices Gateway (geralmente mais adequado para microservicos)

Capacidade de rotear trafego de entrada para apis
em geral nao oferecem suporte ao ciclo de vida das apis
maioria é open source

Geralmente nao possuem dependencia externa (stateless) e sao componentes standalone, o que faz com que a plataforma (k8s) gerencia o estado ecessario [para a execucao da aplicacao
Tornando mais escalavel (é mais facil aumentar o numero de pods)

Proposito principal
Exposicao, observabilidade e monitoramento de APIs (servicos)

Manutencao das APIS
time de api ou time de criacao/mautencao do servico via configuracao declarativa fazem atualizacoes, esta tarefa faz parte do depoyment dos servicos

Suporte a ambientes
A intancia controla um unico ambiente, possui suporte a roteamento mais dinamico como por exemplo Canary para facilitar o debugging

Dicas
Use a flexibilidade do deploymente para "particionar" suas apis (use bounded context do DDD)

tente ser stateless o maximo possivel isso vai aumentar muito a facilidade escalabilidade / disponibilidade

reduza o numero de instancias para ganhar experiencia na gestao pdo ambiente
numero de instanicia pode ser um problema em equipes sem experstise em monitoramento / observabilidade

granularidade fina demais pode complicar a manutencao das apis

automacao deve ser pensada desde o inicio

Api gateway pode atuar em 2 diferentes modos (podem ser aplicados ao mesmo tempo)

no edge da aplicacao - PEP - api gateway police enforcment point
ou atuando em contextos, dividindo um conjunto de apis em um contexto especifico

Kong API

- Open Source
- Caracteristicas micro gateway
- deployment flexivel (edge, ou para segregacao (contexto))
- pronto para kubernetes
- extensivel via plugins (policies)
- Utiliza Open Resty e nginx, open resty ajuda com algumas configuracoes do nginx como o reload, e permite que sejam rodados scripts lua em cima do nginx
  Adiciona uma camada runtime com lua, baseado nisso que o Kong possui uma arquitetura de plugins, e grande parte dos plugins ja existentes, open source, foram criados utilizando a linguagem lua
- plugins podem ser aplicados globalmente ou por rota, ou consumer

Terminologia e Principais conceitos

Downstream (Consumers) = a aplicacao ou o cliente que esta consumindo a api
Proxy (Rotas e Plugins) = Kong API
Upstream (service targets) = Back end, servicos protegidos pelo Kong

Subscriptions

Free

Plus ($250 service/month)

- More plugins
- Email support

Enterprise ($ custom)

- Fully self managed deployment
- 24/7 tech support
- Service mesh integration

On-premise
SAAS - Kong Connect

Modelos de deployment

DB-Less
YAML o JSON file configuration

- importante bloequar a api de admnistracao para que nao seja possivel fazer mudancas em apenas 1 no utilizando chamadas de api
- o arquivo de configuracao precisa estar em um file system distribuido
- alguns plugins nao sao copativeis com esse modelo ou sao parcialmente compativeis como por exemplo o oauth2

With Database
The source of truth is a shared database between thr kong nodes

Deployment distribuido

         -- Control Pane (Kong Gateway Instance) - Kong Manager + Dev Portal

Database -- Data Plane (Kong Gateway Instance)
-- Data Plane (Kong Gateway Instance)

Deployment Hibrido (recomendado)

Database
|
|
Control Pane (Kong Gateway Instance) - Kong Manager + Dev Portal
|
|
-- Data Plane (Kong Gateway Instance)
-- Data Plane (Kong Gateway Instance)

Keycloack - Identity and Access Management - SSO

Konga

Open Source interface administrativa para o Kong API Gateway
Utiliza a API administrativa do kong

Consumer = Representa um consumidor que pode ser um usuario ou um servico
Pode sser utilizado para aplicacao de plugins de seguranca

monitoramento

metricas

prometeus / graphana

Logging

Fluent bit + tcp log plugin
Elastic search + kibana

DataDog

tracing distribuido

jaeger + zipkin plugin

Automatize!

Kong + Kubernetes

Kubernetes Ingress

é a maneira de realizar exposicao de rotas HTTP e HTTPs para fora do cluster
esse roteamento de trafego é controlado por regras definidas dentro do recurso ingress do Kubernetes

e um ponto de entrada para que servicos externos acessem os servicos do Kubernets

IMAGE

Kong e Kubernetes Ingress

IMAGE

developers CI / CD ---> (Ingress events) K8s API Server ---> Controller ---> |
|
|
Services <--- Kong Proxy <--- Clients

Traducao K8S -> Kong

IMAGE

Ingress Rules K8s Service Pods

--> Route -- -- Target
| |
| |
-- Service --> Upstream -- -- Target
| |
| |
Route -- -- Target

K8s Ingress -> Kong Route
K8s Service -> Kong Upstream
K8s Pods -> Kong target

Modelos de Deployment kong kubernetes

Banco de dados

é recomendado nao utilizar deployment do tipo statefull no k8s com por exemplo banco de dados
portanto o ideal seria colocar o banco de dados fora do ambiente containerizado

IMAGE

Configuracao

K8s API Server --- > Control Pod(s) - com 2 kong containers ---> Postgres SQL
Ingress controller + Control Plane

Client

Postgress SQL ---> Proxy Pod(s) com 1 kong container -> Orders
Data Plane -> Inventory

DB-Less K8s

IMAGE

Ideal para K8s pois é stateless

K8s API Server --- > Kong Pod(s) (Controller + Data Plane)

Kong Pod(s) (Controller + Data Plane) --- > Orders
--- > Inventory

Os pods do Kong sempre terao 2 containers (controller + data plane)
Controller ira receber as requisicoes do K8s (objetos ingress) transformalas e fazer chamadas para a api do kong (localhost) e configurar o data plane

Ou seja nao mantenho nenhum estado do kong
e caso ocorra algum problema e o K8s precise recriar a configuracao do ingress, o kong ira receber novamente as requisicoes e fazer a configuracao conforme os objetos que receber

O fluxo de dados do cliente sempre ira vir para o Data plane

Criando Cluster de K8s Local

Ferramentas

Kind | minikube | microk8s
kubectl
helm v3

- Cria um cluster usando kind e aponta esse cluster para um k8s cluster criado localmente
  cd kong-automation/infra/kong-k8s/kind
  ./kind.sh

kubectl get pods -A

- Depois que todos os clusters estiverem provisionados:
- Instala o kong usando um helm padrao da comunidade

  - a imagem do kong esta customizada com 2 plugins adicionais
  - database is off, pois sera usada a configuracao usando custom resources, o ingress sera usado para controlar os artefatos, de certa forma ja temos o banco de dados do k8s
  - plugins precisam ser declarados no arquivo de conf (bundled = todos os plugins do kong open source)
  - alem de colocar os plugins na pasta especifica do kong, precisamos incluilos no arquivo de conf
  - admin = portas administrativas
  - installCRDs = flag de compatibilidade com a versao do helm2
  - proxy type NodePort pois esta local (poderia ser clusterAIP, ou load balance caso queira expor o kong na infra)

- configura namespace e faz a instalacao via helm
  cd kong-automation/infra/kong-k8s/kong
  ./kong.sh

get pods -n kong

watch -n 0.2 get pods -n kong

kubectl logs <POD_ID> proxy -n kong

- Cria o namespace de monitoramento e faz a aplicacao de um helm para fazer a instalacao do prometheus
  cd kong-automation/infra/kong-k8s/misc/prometheus
  ./prometheus.sh

- Instala o keycloak OIDC
  cd kong-automation/infra/kong-k8s/misc/keycloack
  ./keycloack.sh

- cria os servicos de test
  kubectl create ns bets
  kubectl apply -f kong-automation/infra/kong-k8s/misc/apps --recursive -n bets

Kong Custom Resource Definitions

Objetos do Kong em formato K8s
Para cada entidade do Kong vamos ter um objeto do K8s correspondente

Plugins

kong-automation/infra/kong-k8s/misc/apis

- create rate limit plugin
  kubectl apply -f kong-automation/infra/kong-k8s/misc/apis/kratelimit.yaml -n bets

- create prometheus plugin (global!)
  kubectl apply -f kong-automation/infra/kong-k8s/misc/apis/prometheus.yaml

Ingress

kong-automation/infra/kong-k8s/misc/apis

!! konghq.com/override: do-not-preserve-host (Might be a problem for 20min, since its using the host info on user service)

!! upstream: host_header = por padrao o ingress do kong vai fazer o load balance pelos ips dos pods
caso queria delegar o modelo de roteamento do kongo para o k8s é preciso incluir a seguinte anotacao na rota
annotations: ingress.kubernetes.io/service-upstream: "true"
e definir do-not-preserve-host e definir host_header: <service_name>.<service_name>.svc (bets.bets.svc)

- create bets route
  kubectl apply -f kong-automation/infra/kong-k8s/misc/apis/bets-api.yaml -n bets

kubectl apply -f ./infra/kong-k8s/misc/apis/king.yaml -n bets

http://localhost/api/bets

kubectl get pods -n kong
kubectl logs <POD_ID> proxy -f -n kong




## Kong

[Kong or Kong API Gateway](https://github.com/Kong/kong) is an open-source API Gateway that runs natively on Kubernetes, and is extensible via plugins.
By providing functionality for proxying, routing, load balancing, health checking, authentication (and more), Kong serves as the central layer for orchestrating microservices or conventional API traffic with ease.
Kong is fully platform agnostic. This means that it supports distributed setups in the cloud and on-premises.

Kong is available in the following modes:

- **Kong Gateway (OSS)**: an open-source package containing the basic API gateway functionality and open-source plugins. You can manage the open-source Gateway with Kong’s [Admin API](https://docs.konghq.com/gateway/latest/#kong-admin-api) or with [declarative configuration](https://docs.konghq.com/gateway/latest/#deck).
- Kong Gateway (available in Free, Plus, or Enterprise modes): Kong’s API gateway with added functionality.

[Documentation](https://docs.konghq.com)

### Kubernetes Deployment

The [Kubernetes Ingress Controller](https://github.com/Kong/kubernetes-ingress-controller) translates Kubernetes resources into Kong configuration. Kong uses that configuration to route and control traffic.

![Kubernetes Ingress Controller Design](https://docs.konghq.com/assets/images/docs/kubernetes-ingress-controller/high-level-design.png)

The Controller Manager listens for changes happening inside the Kubernetes cluster and updates Kong in response to those changes to correctly proxy all the traffic.

#### Translation

Kubernetes resources are mapped to [Kong resources](https://docs.konghq.com/kubernetes-ingress-controller/latest/concepts/custom-resources) to correctly proxy all the traffic.

> When using Kong with Kubernetes Ingress Controller, the source of truth for Kong’s configuration is the Kubernetes configuration in etcd: [Kong’s custom Kubernetes resources](https://docs.konghq.com/kubernetes-ingress-controller/latest/concepts/custom-resources), ingresses, and services provide the information necessary for the ingress controller to configure Kong.

#### Deployment Options

The [kong-gateway](https://hub.docker.com/r/kong/kong-gateway) proxy image supports [DB-less (Stateless) operation](https://docs.konghq.com/gateway/2.8.x/install-and-run/kubernetes) and is **recommended** for all deployments. But, the Kubernetes Ingress Controller is designed to be deployed in a [variety of ways](https://docs.konghq.com/kubernetes-ingress-controller/2.5.x/concepts/deployment) based on uses-cases.

> In general, DB-less deployments are simpler to maintain and require less resources to run. However, [not all plugins are compatible with DB-less operation](https://docs.konghq.com/kubernetes-ingress-controller/latest/references/plugin-compatibility) (Third-party plugins are generally compatible with DB-less).

##### DB-less

In DB-less deployments, Kong’s Ingress controller runs alongside and dynamically configures Kong as per the changes it receives from the Kubernetes API server.

![DB-less](https://docs.konghq.com/assets/images/docs/kubernetes-ingress-controller/dbless-deployment.png)

Since each pod contains a controller (container which configures Kong) and a Kong container (which proxies the requests), scaling out simply requires horizontally scaling this deployment to handle more traffic or to add redundancy in the infrastructure.

##### Deployment on Kubernetes with Helm

Kong is a highly configurable piece of software that can be deployed in a number of different ways, depending on your use-case.
All combinations of various runtimes, databases and configuration methods are supported by [this Helm chart](https://github.com/Kong/charts/tree/main/charts/kong).

**The recommended deployment approach is to use the Ingress Controller based configuration along-with DB-less mode.**

For more details, see [How to Install on Kubernetes with Helm](https://docs.konghq.com/gateway/2.8.x/install-and-run/helm/) and the [readme file in the chart repository](https://github.com/Kong/charts/blob/main/charts/kong/README.md).

#### Migrating between deployment types

Because etcd is the source of truth for Kong’s configuration, the ingress controller can re-create Kong’s proxy configuration even if the underlying datastore changes.

No changes to Kubernetes resources are required if migrating from a DB-less deployment to a database-backed deployment.

> [This document explains the security aspects of the Kubernetes Ingress Controller](https://docs.konghq.com/kubernetes-ingress-controller/2.5.x/concepts/security).

### Extending the Kong API Gateway (Plugins)

Kong is a Lua application running in Nginx. It is distributed along with [OpenResty](https://openresty.org). This sets the foundations for a modular architecture, where plugins can be enabled and executed at runtime.

Kong provides many [plugins](https://docs.konghq.com/hub/). And we can also create our own custom plugins, with Lua or [other languages](https://docs.konghq.com/gateway/2.8.x/reference/external-plugins/).

[Kong Gateway support for the JavaScript language](https://docs.konghq.com/gateway/latest/reference/external-plugins/#developing-javascript-plugins), TypeScript is also supported, plugin written in TypeScript can be loaded directly and transpiled on the fly.

See also [how to set up custom plugins in Kubernetes environment](https://docs.konghq.com/kubernetes-ingress-controller/latest/guides/setting-up-custom-plugins), and [how to use KongClusterPlugin resource to configure plugins in Kong](https://docs.konghq.com/kubernetes-ingress-controller/latest/guides/using-kongclusterplugin-resource).