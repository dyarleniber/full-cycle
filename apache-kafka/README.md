[Back](../README.md)

# Apache Kafka





producer > kafka > brokers < consumer


kafka = cluster = conjuntos de nos = brokers (nos)


each broker has its owm database


recommendation of in 3 brokers


Kafka ZooKeeper
ZooKeeper is used in distributed systems for service synchronization and as a naming registry. When working with Apache Kafka, ZooKeeper is primarily used to track the status of nodes in the Kafka cluster and maintain a list of Kafka topics and messages.

Starting with version 2.8, Kafka can be run without ZooKeeper. The release of 2.8.0 in April 2021 provided us all a chance to start using Kafka without ZooKeeper.  However, this version is not ready for use in production and is missing some core functionality.  One important component not yet available in this version is control of ACL.  










Topic

Canal de comunicacao responsavel por receber e disponibilizar os dados enviados para o kafka

O mesmo topico pode ser lido por quantos consumers eu quiser
A mensagem pode ficar disponivel para todos os consumers lerem

Cada mensagem enviada para um topico é armazenada em sequencia, uma atras da outra.
Cada mensagem ganha um offset (comecando por 0) quando ela é armazenada em uma particao de um topico (tipo um id, 0, 1, 2 etc).
- O offset é sequencial por particao

Portanto como cada mensagem ganha um offset e é armazenada em sequencia nao tem problema nenhum um consumer ler as mensagens mais lentamente que outro. um consumer pode inclusive ler as mensagens dias depois que elas forem armazenadas.

inclusive é possivel ler novamente as mensagens, por exemplo, caso um consumer tenha tido problema ao processar as mensagens em um determinado periodo, ele pode voltar naquele topico e comecar a ler novamente a partir de um offset em especifico
Isso é possivel porque as mensagem sao armazenadas em disco, elas nao ficam na memoria como no RabitMq







Anatomia de um registro (mensagem)


- Headers (metadados)
- Key (contexto da mensagem, é usado principalmente para garantir a ordem das entregas, definindo uma key, todos as mensagem com a mesma key serao entregues na mesma particao, portanto terao offsets sequenciais, e serao lidar em ordem pelo consumer)
- value (payload da mensagem, conteudo em si)
- timestamp



Particoes

cada topico pode ter uma ou mais particoes para conseguir garantir a distribuicao e resiliencia de seus dados

 
Topic X -> Partition 1 (Inside broker A)
		-> Partition 2 (Inside broker B)
		-> Partition 3 (Inside broker ...)

Conforme aumentamos a quantidade de particoes, as mensagens ficam mais distribuidas em diferentes particoes, em diferentes brokers (maquinas). Quando mandamos uma mensagem para um topico a mensagem pode ser armazenada em qualquer particao, em qualquer broker.
Isso ajuda a aumentar a resiliencia, e tambem ajuda a aumentar a escalabilidade do Kafka, pois como as mensagens sao armazenadas em diferentes brokers (maquinas), eu posso separar a leitura e processamento das mensagens em diferentes maquinas (consumers), pois eu posso dividir a leitura e processamento das mensagens de cada participacao para uma maquina diferente, e nao corro o risco de duas maquinas lerem a mesma mensagem.

Entretanto podemos ter um problema com essa abordagem, como o offset é definido com base na particao, ou seja seguindo a ordem das mensagem da particao em que a mensagem foi incluida, as mensagens podem ser lidas em diferente ordem, caso elas sejam armazenadas em particoes diferentes.
Para resolver esse problema utilizamos as keys, keys servem principalmente para garantir a ordem das entregas, definindo uma key, todos as mensagem com a mesma key serao entregues na mesma particao, portanto terao offsets sequenciais, e serao lidar em ordem pelo consumer

E quando eu nao preciso de uma ordem, eu nao preciso informar um valor para a key.







Replication factor (particoes distribuidas)

Se uma particao dentro de um topico for armazenada apenas em um unico broker, caso esse broker caisse eu perderia todas as mensagem dessa particao.
Para evitar esse problema e garatir uma maior resiliencia do nosso sistema, podemos definir um valor para o Replication factor.

Quando criamos um topico no Kafka podemos definir a quantidade de particoes na qual as mensagens serao distribuidas, e tambem um valor para o Replication factor.
Por exemplo, definindo um replication factor de 2, cada particao devera ter pelo menos uma copia dos dados em um broker diferente, ou seja, os dados de cada particao estarao armazenados em 2 brokers (maquinas) diferentes.

Quanto mais critico sao os dados de um topico, podemos definir um valor maior de replication factor, entretanto precisamos levar em consideracao que quanto maior o numero de particoes, e maior o numero de replication factor, maior sera o armazenamento em disco necessario para manter o Kafka rodadndo.

Normalmente os valores mais comuns de replication factor sao 2 e 3.
3 para topicos extremamente criticos, e 2 seria o minimo para garantir resiliencia.


Partition leadership

Cada particao distribuida tera uma partition leader, ou seja, sempre que um consumer for ler uma mensagem de um determinado topico em uma determinada particao, ele sempre ira ler apartir da particao lider (nao importa quantas copias cada particao tera em diferentes brokers, apenas uma delas sera a lider). Quando um broker cair, o Kafka identifica que esse broker nao esta mais disponivel, e transfere as liderancas que estavam naquele broker de cada particao, para outros brokers que possuem copias dessa particao.
As particoes copias que nao sao leaders, recebem o titulo de particao follower.


esse processo de identificar que um broker caiu e transferir a lideranca de determinadas particoes para outro broker é muito rapido dentro do kafka.


Alem do consumer sempre ler a mensagem a partir da particao lider. O producer tambem sempre escreve a mensagem a particao lider.








Garantia de entrega das mensagens


Quando o producer envia uma nova mensagem, podemos definir o parametro acks.
Esse parametro diz respeito a quantidade de particoes (brockers) que devem receber a mensagem antes de condiderar ela entregue (ou escrita) com sucesso.
Suporta 3 valores:

acks=0
nesse modo o producer nem espera por resposta, a mensagem é imediatamente considerada entregue no momento que é enviada
tambem conhecido como ff, fire and forget

Quando utilizamos o acks=0 nao temos garantia de que as mensagems foram escritas, ou seja temos um sistema mais suscetivel a falhas e menos resiliente, entretanto, ganhamos com uma menor latencia, e um throughput maior.

por outro lado, utilizando acks=all temos uma garantia que todas as mensagem estao salvas e seguras, entretanto com uma maior latencia e menor throughput.

Esse é um tradeoff que deve ser levado em consideracao ao definir a configuracao de nossa applicacao.

Um caso de exemplo para acks=0 seria por exemplo em um aplicativo tipo o Uber, aonde a cada 10 segundos o app precisa mandar a localizacao do motorista, nesse caso nao seria tao ruim se uma vez ou outra essa mensagem nao fosse entregue com sucesso, pois outra mensagem seria enviada em seguida com a localizacao atualizada. entretanto precisamos sim de um throughput muito maior, pois enviaremos diversas mensagens novas por minuto. Nesse caso seria ideal utilizar o acks=0


acks=1
a mensagem sera considerada entregue assim que a particao leader receber a mensagem, salvar e responder com sucesso
Porem, caso o brocker caia logo apos receber a mensagem, e nao tenha tido tempo de fazer replicas dessa mensagem para os followers, ela sera perdida.
ou seja, prove uma garantia minima, mas nao uma garantia total.


acks=-1 ou acks=all
a mensagem sera considerada entregue assim que a particao leader receber a mensagem, salvar e responder com sucesso, replicar as mensagens para todos os followers, os followers vao salvar a mensagem e retornar para o leader. e apos uma confirmacao do leader e de todos os followers, a mensagem sera considerada entregue

ou seja, temos uma garantia total que todas as mensagem estao salvas e seguras, entretanto com uma maior latencia e menor throughput. a performance nesse caso é muito menor, comparada com o modo acks=0




Modos de garantias de entrega que o Kafka pode trabalhar 

At most once — Melhor performance. Consumer pode perder algumas mensagens. 
At least once — Performance moderada. Consumer vai receber todas as mensagens, porem podem haver duplicidades. Nesse modo é importante que o consumer possua algumas validacoes para mensagens duplicadas, e evitar processa-las 2 veses.
Effectively once ou Exacly once — Pior performance. Consumer vai receber todas as mensagens apenas uma vez.
No guarantee — Quando nenhuma garantia é informada, o consumer pode receber mensagens uma vez, multiplas vezes ou nunca.








Producer: indepotencia


Imagine o seguinte cenario, ao enviar uma mensagem para o broker acontece um problema de rede, entao o producer envia a mensagem novamente e recebe a confirmacao.
Porem aquela mensagem que teve problema de rede, por algum motivo é feito um retry, e ela é enviada novamente.
Nesse cenario podemos ter uma mensagem duplicada no broker.

Nesse caso podemos dizer que a indepotencia do producer é off, ou seja, assumimos que podemos ter duplicidades devido a falhas de redes.
E o consumer pode ler a mensagem 2 vezes.


Para evitar esse problema, podemos definir o producer como indepotente (on).
Quando o producer é indepotente, na situacao descrita acima, o kafka identifica que uma duplicidade ocorreu, e descarta uma das mensagens.
Com isso a latencia pode ser maior, porem temos uma seguranca que a mensagem nao sera duplicada, e sera entregue na ordem correta (devido aos timestamps)









Consumer groups


Quando temos apenas 1 consumidor, ele devera ler mensagens de todas as particoes

Producer -> Topic 		
			Partition 0 -> -> Consumer A
			Partition 1 -> -> Consumer A
			Partition 2 -> -> Consumer A

Nesse caso, dividir as mensagens em varias particoes nao afetara o desempenho, pois continuamos tendo apenas um consumer que precisara ler mensagens de todas as particoes.



Por outro lado podemos definir grupos de consumidores

Producer -> Topic 		      Group X
			Partition 0 -> -> Consumer A
			Partition 1 -> -> Consumer A
			Partition 2 -> -> Consumer B

Consumer A and Consumer B pode ser exatamente o mesmo software rodando em maquinas diferentes, ou processos diferentes.

Quando definimos diversos consumers dentro de um grupo, podemos dividir a leitura das particoes entre os consumers,
no exemplo acima, possuimos 2 consumers e 3 particoes, e o consumer A seria responsavel por ler as 2 primeiras particoes, enquanto o consumer B seria responsavel por ler apenas a ultima particao.

Caso tivessemos um terceiro consumer FORA do grupo, esse estaria lendo todas as 3 particoes, APENAS conseguimos dividir a leitura das particoes entre determinados consumers, quando esses consumers fazem parte de um MESMO grupo.

Quando nao definido um grupo para um consumer, o kafka entende como se esse consumer estivesse em um grupo com mais nenhum outro consumer, entao ele sera responsavel por ler a partir de todas as particoes




Os melhor dos mundos nesse examplo, seria ter um consumer para cada particao, todos dentro de um mesmo grupo

Producer -> Topic 		      Group X
			Partition 0 -> -> Consumer A
			Partition 1 -> -> Consumer B
			Partition 2 -> -> Consumer C

Nesse cenario temos o consumer A, B e C, e cada um sera responsavel por uma particao, pois estao todos dentro de um mesmo grupo.
A performance nesse caso sera superior aos exemplos anteriores.







Importante: é impossivel 2 consumers dentro de um mesmo grupo ler a mesma particao, é possivel apenas para 2 consumers em grupos diferentes ler a mesma particao.

Producer -> Topic 		      Group X
			Partition 0 -> -> Consumer A
			Partition 1 -> -> Consumer B
			Partition 2 -> -> Consumer C
							  Consumer D

Nesse caso aonde temos mais um consumer dentro do grupo X, esse consumer que esta sobrando ficara idle, ou seja , nao ira ler de nenhuma particao.


Ou seja, nao adianta criar diversas particoes, se temos poucos consumer.
Mas tambem nao adianta criar diversos consumers, se a quantidade de consumers for maior que a quantidade de particoes.

O ideal seria ter a mesma quantidade de consumers e particoes.






CLI Commands

Run Kafka docker container
docker exec -it examples-kafka-1 bash

Create topic
kafka-topics --create --topic=test --bootstrap-server=localhost:9092 --partitions=3

List topics
kafka-topics --list --bootstrap-server=localhost:9092

Describe topic
kafka-topics --bootstrap-server=localhost:9092 --topic=test --describe

Consume a topic (Create an independent consumer)
kafka-console-consumer --bootstrap-server=localhost:9092 --topic=test

Produce a message
kafka-console-producer --bootstrap-server=localhost:9092 --topic=test

Consume a topic from beginning (Create an independent consumer)
kafka-console-consumer --bootstrap-server=localhost:9092 --topic=test --from-beginning

Consume a topic inside group X (Create a consumer)
kafka-console-consumer --bootstrap-server=localhost:9092 --topic=test --group=x

Describe consumer group
kafka-consumer-groups --bootstrap-server=localhost:9092 --group=x --describe





Control Center is available at http://localhost:9021

Confluent Control Center is a web-based tool for managing and monitoring Apache Kafka®. Control Center provides a user interface that enables you to get a quick overview of cluster health, observe and control messages, topics, and Schema Registry, and to develop and run ksqlDB queries.











Duvidas
- Os offsets sao dados com base na ordem da particao? e nao do topico como um todo?
- Quanto tempo as mensagens ficam armazenadas, enquanto estiverem aguardando para serem lidas, e apos serem lidas?














