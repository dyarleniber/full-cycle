[Back](../README.md)

# Fundamentals of software architecture

## Software architecture

Software architecture is a discipline of software engineering.
According to the IEEE Standard 1471, developed by the IEEE Computer Society. Software architecture is the fundamental organization of a system embodied in its components, their relationships to each other, and to the environment, and the principles guiding its design and **evolution**.

A software has to be developed always thinking about the long term and that's the key point. The software architecture helps us make this design so that this software is sustainable. So the process of architecting a software establishes that what is being developed is part of a larger set and normally this larger set is the business, meeting the needs of the business in the short, medium and long term.

According to the Conways' Law:
> Any organization that designs a system (defined broadly) will produce a design whose structure is a copy of the organization's communication structure.

So, the role of a software architect is to define the structure of the software, by transforming the business requirements into architectural patterns, and working together with the development team and the domain experts to define the most appropriate architecture.

### Software architecture vs Software design

Software architecture requires a high level view of the software, and hides the details of the implementation. It focuses on how the components interact with one another.
And software design concentrates on the details of how components are implemented, for example, the selection of algorithms and data structures.

## Architecture requirements

Checklist of requirements for software architecture:

Some examples of architecture requirements are:
- Performance
- Scalability
- Reliability
- Security
- Storage
- Legal and regulatory compliance
- Marketing statistics
- And many more.

## Architecture characteristics

Every software has some architecture characteristics that can be bad when we don't spend enough time thinking about them. When developing or designing a software, it is important to understand what are the architecture requirements, and think about the architecture characteristics that are important to meet the requirements, ie, structuring the software **intentionally**.

We can divide the architecture characteristics into the following areas:
- Operational characteristics
- Structural characteristics
- Cross-cutting characteristics

### Operational characteristics

The operational characteristics, as the name suggests, are the ones that are related to the operation of the software. In other words, those that will make our software easy to operate.

- **Availability**
  - How long can the software be unavailable?
- **Disaster recovery**
  - How can the software recover from a disaster? What is the recovery process?
  - Soften the consequences of an unavailability.
  - Mitigate a disaster, and prevent it from happening again.
  - Are we willing to pay for multi-region support? Or even multi-cloud support?
- **Performance**
  - How many requests can the software handle? (Throughput)
  - How long can the software take to respond to a request? (Latency)
- **Backup**
  - Create a backup automatically from time to time.
  - Test the backup system.
  - Store the backup separately from the main data, in a different network. (It can be efficient in case our application suffers a ransomware attack)
- **Reliability**
  - All flows in our system must be defined to avoid gaps that malicious users can take advantage of. For example, in a registration flow, not validating the user's email, with a validation sent to the registered email, can leave a gap for robots to create several fake users in our system. This is very much related to the reliability of our app.
- **Security**
  - Prevent/Mitigate brute force attacks
    - Captcha
    - Rate limiting
    - etc
  - Prevent/Mitigate DDOS attacks
  - etc
- **Robustness**
  - A robust software is one that can scale if needed.
  - It is important to take into account that cloud services are not infinite.
    - For example, there are a lot of companies that runs more than 100 thousand servers instances simultaneously. Let's say that the AWS region is down, and we need to move to a different region to keep our application running. What if this new AWS region does not have enough capacity to support those more than 100 thousand servers instances? So, even with AWS behind our application, we can still have issues to deploy/scale our application.
- **Scalability**
  - There are basically two types of scalability:
    - Horizontal
      - When we increase the computing resources of our server.
    - Vertical
      - When we add more servers.
  - It is necessary to ensure that our application can scale. Mainly, scale horizontally.
    - To ensure horizontal scalability, it is important not having state in our server/application.
    - Another **very important** thing is following some best practices in the development process. The best example, is [The Twelve-Factor App](https://12factor.net/).

### Structural characteristics

The structural characteristics, are related to the development process of the software. Those that will make our software more flexible and maintainable.

- **Configurable**
  - A configurable application is one that allows us to run it in different environments **without** changing the code.
    - We can achieve this by using **environment variables** for our database configuration, third party credentials, and so on.
    - Another example is the payment gateway. If our payment gateway is down, is it easy to change it to a different one?
- **Extensible**
  - An extensible application is one that allows us to add new features to it **easily**.
  - For example, we should be able to add a new payment gateway without changing core parts of the application.
  - We must work with interfaces, adapters, and so on.
- **Easy to install/set up**
  - Standardize the environment/installation process.
    - Using Docker containers is the best way to do this.
  - Should be easy to set up a new environment for staging, production, development and so on.
- **Reusable components**
  - Reuse components in our application can be very useful. In a monolithic application, it is easy to reuse components, since everything is inside the same system. However, in a microservice architecture, it is not so easy. Sometimes we end up creating identical components in different systems, then we need to start thinking about how to reuse them among the microservices.
- **Internationalization**
  - Besides the language, we can also have different currencies, different timezones, different countries, etc. All these aspects should be taken into account when designing an application that is internationalized.
- **Easy to maintain**
  - SOLID principles, Design patterns, Tests, Documentation, etc.
  - Should be easy to add new features, and to change existing ones.
  - We should be confident that big refactors, new features, etc. will not break our application. We can achieve this by covering our codebase with tests.
- **Portable**
  - Portability means being less dependent on third party libraries/vendors in our application.
- **Easy to support**
  - Observability.
  - Monitoring.
  - Define a standard for logging, metrics, and so on, and centralize them.
  - We should be able to understand what is going on in our application.

### Cross-cutting characteristics

Cross-cutting characteristics are aspects that will cross the application in general, that is, they are things that we always need to take into account on a daily basis.

- **Acessibility**
- **Data retention and recovery process**
- **Authentication and authorization**
- **Compliance with legal and regulatory requirements**
- **Privacy**
- **Security**
- **Usability**
- 

- Acessibilidade
  - Front end
- processo de rentencao e recuperacao de dados (quanto tempo os dados serao mantidos)
  - Separar dados quentes e dados frios (utilizando diferente tipos de storage (mais baratos para dados frios))
- Autenticacao e autorizacao
  - IDP em arquiteturas distribuidas
  - API Gateway (politicas de autenticacao, timeouts, etc)
- conformidade com a lei
- Privacidade
  - Mitigar possiveis vazamentos de dados
- Segurança
  - webfirewall
  - OWASP
  - Utilizar padroes abertos (boas praticas)
- Usabilidade
  - Front end (mas nao apenas front end)
  - Usabilidade de apis (backend)
  - Documentar APIs

## Perspecivas para arquitetar software de qualidade

### performance

Desempenho que um software possui para completar um determinado workload.

Unidades de medidas para avaliar performance:
- Latencia ou response time
- Throughput (quantidade de requisicoes por segundo)

Performance é diferente de escalabilidade.

Metricar para medir performance:
- Diminuir latencia
  - Normalmente medida em milisegundos
  - é afetada pelo tempo de processamento da aplicacao, rede e chamadas externas
- Aumentar throughput
  - Quantidade de requisicoes
  - Diretamente ligado a latencia

Razoes para baixa performance:
- processamento ineficiente
- recursos computacionais limitados
- trabalhar de forma bloqueante
- acesso serial (sem concorrencia) a recursos

Principais formas para aumentar a eficiencia:
- Escala da capacidade computacional (CPU, Disco, Memoria, Rede)
- Logica por tras do software (Algoritmos, queries, overhead de frameworks)
- Concorrencia e paralelismo
- Concorrencia: usar recursos de forma paralela
- banco de dados (tipos de banco de dados, schema)
- Caching

#### Caching

Caching is a way to reuse data that has been computed previously. It can be a database query, a network request, or any type of heavy computation.

- Edge computing / Cache na borda
- dados estaticos
- paginas web
- funcoes internas
  - evita processamento de algoritmos pesados
  - acesso ao banco de dados
- objetos

Caching exclusivo:
- Baixa latencia
- duplicado entre os nos (servidores)
- problemas relacionados a sessoes

Caching compartilhado:
- Maior latencia
- nao existe duplicidade entre os nos (servidores)
- Sessoes compartilhadas
- banco de dados externo
  - mysql
  - redis
  - memcached

##### Edge computing

- Cache realizado mais proximo ao usuario
- Evita a requisicao chegar ate o Cloud Provider / Infra
- Normalmente arquivos estaticos
  - Cloudflare
- CDN (Content Delivery Network)
  - Akamai
- Cloudflare workers
- Vercel

### escalabilidade

Scalability is the ability to scale a system to meet a new demand. Increasing or decreasing the resources.
While performance focuses on decreasing latency and increasing throughput, scalability aims to have the possibility of increasing or decreasing the throughput by adding or removing the computational capacity.

Escala vertical:
- Aumentar ou diminuir a capacidade computacional (CPU, Disco, Memoria, Rede) do servidor.

Escala horizontal:
- Aumentar ou diminuir o numero de servidores.
- Load balancing

Trabalhar com escala vertical geralmente é mais limitante devido ao fato de que a capacidade computacional de um unico servidor é muito menor do que escalar horizentamente utilizando mais servidores.
Outro downsizing de escalar verticalmente é que se esse unico servidor cair, o sistema como um todo cai.

O mais comum hoje em dia é escalar horizontalmente.

#### escalabilidade horizontal - descentralizada

- Dependendo de como o sofware foi construido, nao sera possivel esclar horizentamente sem que ajustes sejam feitos.

é importante levar em consideracao que os servidores sao descartaveis (podem ser incluidos novos ou removidos a qualquer momento). para isso alguns guidelines devem ser seguidos na construcao do sistema.
- disco efemero
  - Tudo que é salvo em disco pode ser apagado a qualquer momento
    - Ex: Imagens de produtos, perfis de usuarios, etc nao podem ser salvos em disco local dentro do servidor da aplicacao. o ideal seria utilizar um armazenamento na nuvem.
- Servidor de aplicacao vs servidor de assets
- cache deve ser compartilhado entre os servidores
- Sessoes devem ser compartilhadas entre os servidores tambem
- A APLICACAO PRECISA SER STATELESS

##### escalabilidade de banco de dados

- Distrubuindo responsabilidades (escrita vs leitura)
- Shards de forma horizontal
- Escolher determinado banco de dados para cada solucao. Ex: Cassandra, MySQL, MongoDB, etc
- Serverless
- Otimizacao de queries e indices no banco de dados
- Utilizar APM (Application Performance Monitoring) nas queries
- Explain nas queries
- CQRS (Command Query Responsibility Segregation)

#### Reverse Proxy

Um proxy reverso é um servidor que fica na frente dos servidores web e encaminha as solicitacoes do cliente para esses servidores web.

It can also work as a load balancer, which is a proxy that distributes the requests to the servers.

Most common solutions are:
- Nginx
- HAProxy
- Traefik


### Resiliencia

Resiliencia é um conjunto de estrategias adotadas intencionalmente para a adaptacao de um sistema quando uma falha ocorre.


#### Proteger e ser protegido

Um sistema em uma arquitetura distribuida precisa adotar mecanismos de autopreservacao para garantir ao maximo sua operacao com qualidade.

Formas de protecao:
- Retornar 500 quando ocorrer um servico comecar a demorar muito para responder requisicoes (seja por causa de um numero muito alto de requisicoes que estao chegando ou outro motivo)
  - Um sistema lentro nno ar muitas veses é pior do que um sistema fora do ar (efeito domino)
- Criar mecanismos para perceber que um determinado servico esta mais lento que o normal, e nao realizar mais requisicoes em um sistema que esta falhando.


#### Health check





# References

- [IEEE Standard 1471](https://standards.ieee.org/ieee/1471/2187)
- [Conways' Law](https://en.wikipedia.org/wiki/Conway%27s_law)
- [Fundamentals of Software Architecture by Mark Richards, Neal Ford](https://www.oreilly.com/library/view/fundamentals-of-software/9781492043447/)
- [Fundamentals of Software Architecture - Reading notes](https://github.com/zhangjunhd/reading-notes/blob/master/software/FundamentalsOfSoftwareArchitecture.md)
