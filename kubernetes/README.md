[Back](../README.md)

# Kubernetes

Kubernetes (k8s) is an open-source system for automating deployment, scaling, and management of containerized applications.

The k8s command line tool (`kubectl`) is used to interact with the k8s API server, in order to run commands against the cluster.
`kubectl` stores configuration information about the clusters in a file called `kubeconfig`. This file is located at `~/.kube/config` by default. This file holds all the information needed to connect to the clusters, including the cluster's API server address, authentication information and so on.
In this config file, we can store information about multiple clusters, however, we can only have one active context at a time. The active context is the one that `kubectl` will use to interact with the cluster. The active context is set using the `kubectl config use-context <context-name>` command.

## k8s cluster architecture

A k8s cluster is composed of 2 types of nodes: Control Plane (master) nodes and Worker nodes.
Control Plane is the component that manages the cluster, and Worder is the component that runs the application.

![k8s-cluster](https://user-images.githubusercontent.com/40317398/205502549-f8e9c1c5-fe89-48d4-adb0-41ad11a0f458.png)

### Control Plane

The Control Plane is responsible for maintaining the desired state of the cluster. The Control Plane consists of the following components:

- `kube-apiserver`: Exposes the k8s API. This is the component that `kubectl` interacts with.
- `etcd`: Distributed key-value store used as k8s' backing store for all cluster data.
- `kube-scheduler`: Responsible for scheduling workloads (pods) to nodes.
- `kube-controller-manager`: Runs controllers that are in charge of maintaining the desired state of the cluster.

### Worker

The Worker nodes are where the application containers (pods) are actually run. The Worker consist of the following components:

- `kubelet`: An agent that runs on each node in the cluster. It makes sure that containers are running in a pod.
- `kube-proxy`: Network proxy that maintains network rules on nodes. These network rules allow network communication to your Pods from network sessions inside or outside of your cluster.
- `container runtime`: The software that is responsible for running containers.

## k8s objects

![k8s-objs](https://user-images.githubusercontent.com/40317398/205502566-b305e611-71e6-4cbe-a273-a18b83f81712.png)

- **Pods**: They are the smallest deployable units in k8s. It container one or more containers, usually one container per pod.

- **Deployment**: It is responsible for managing the pods. Inside a deployment, it is possible to define the number of replicas. The main goal of a deployment is to ensure that the desired number of pods is always running.
For example, if we have a deployment with replicas set to 3, k8s will make sure that there are 3 pods running at all times, and if one of them is deleted, k8s will create a new one.
If there are no more resources in the node, k8s will create the pod in another node. And if there are no more nodes available, this new pod will be in a pending state until a new node is available.
> When a deployment is created, it creates a ReplicaSet, and the Pods, so we don't need to create them manually.
> The name of the pods created by a deployment will be in the following format: `<deployment>-<replica-set>-<unique-id>`.

- **ReplicaSet**: It is responsible for managing the number of pods (replicas) that are running. It is created by a deployment, and we usually don't create it manually.
The main problem of using a ReplicaSet directly, without a deployment, is that if we update a configuration of a pod (the version of the image, for example), this new configuration will not be applied to the pods that are already running, instead, it will only be applied to the new pods that are created.
To solve this problem, we can use a deployment, which is one level above the ReplicaSet, and it is responsible for managing the ReplicaSet, and the pods.

- **Service**: It is responsible for exposing the pods in a cluster to the outside world. It is the entry point for the application. It is also responsible for load balancing the requests between the pods.
It uses labels to identify the pods that it should expose, for example, using the `selector` field in the `spec` section of the service definition.
> `port-forward` can also be used to expose a pod, but it is not recommended for production environments.

The 3 main types of services are:

- **ClusterIP**: Exposes the service on a cluster-internal IP. This means that the service is only accessible from within the cluster. This is the default type of service.
- **NodePort**: Exposes the service on each Node's IP at a static port (the `NodePort`). The service is accessible from outside the cluster using `<NodeIP>:<NodePort>` (The range of the `NodePort` must be from 30000 to 32767).
- **LoadBalancer**: Exposes the service externally using a cloud provider's load balancer (it also creates a internal IP, such as the `ClusterIP` service type, and a node port, such as the `NodePort`).

![k8s-svc](https://user-images.githubusercontent.com/40317398/205502618-eeccd3dd-6001-4a17-b3df-862984895f69.png)

> An **Ingress** resource can also be used to expose the services.

When listing the services, we can see that there is also another service called `kubernetes`. This service is created by default and it is used to expose the API server in the cluster.

Each service has an IP address, and the services are accessible (**from inside the cluster**) using this IP address, or using the service name, which is more common.

In order to test the services, we can use the `port-forward` command, but as already mentioned, this is not recommended for production environments: `kubectl port-forward service/<service-name> 8000:<service-port> -n <namespace>` (in this example, the service will be accessible in the port 8000).

Inside the service definition, we can also define the `port` and the `targetPort`. The `port` is the port that the service will be exposed, and the `targetPort` is the port that the container will be accessible.
By defining the `targetPort`, the service will redirect the requests to the container port, when the `targetPort` is not defined, the service will redirect the requests to the same port that the service is exposed (`port`).

## Proxy

It is also possible to start a proxy to the k8s API server using the command `kubectl proxy --port=8080`. When the proxy server is running, we can explore the API using curl, wget, or a browser: `http://localhost:8080`.

## Config Map and Secrets

We can set environment variables inside the YAML deployment manifest file. But, we can avoid this by using ConfigMap or Secrets.

> Besides, we can also use ConfigMap and Secrets to store the configuration files, by mounting them as volumes.

Secrets are used to store sensitive information like passwords, tokens, etc. ConfigMap is used to store non-sensitive information like configuration files, etc.
By using Secrets, the data is stored in base64 format by default. So, we can use the following command to decode the data: `echo <base64_encoded_data> | base64 --decode`.

Even thought Secrets use base64 encoding, it is not totally secure. Since, we can decode the data. The ideal way to use Secrets is to integrate with a secret management tool like Vault. So, no one can access the secrets directly.

As an example, in order to define environment variables using Secrets in a YAML configuration file, instead of defining them as follows:
```yaml
data:
  USER: "userx"
  PASSWORD: "passwordy"
```
We must define them with all the values in base64 format:
```yaml
data:
  USER: "dXNlcngK"
  PASSWORD: "cGFzc3dvcmR5Cg=="
```

The following command can be used to encode the data in base64 format: `echo <data> | base64`.

Remember that the values defined using Secrets are environment variables. So, we can see them by accessing the pod directly:
```bash
kubectl get po
kubectl exec -it <pod_name> -- bash
echo $USER
```

## Probes

Liveness, readiness, and startup probes are all features of Kubernetes that help ensure that applications running in containers are healthy and running smoothly. They should be defined in the pod definition (inside the Deployment manifest file for example).

- **Liveness** probes are used to check if a container is still running, and if it is not, Kubernetes will **restart** it.
> This is useful for containers that might become stuck or unresponsive, as it ensures that the application continues to run without interruption.

There are basically 3 main ways to implement liveness probes:
1. HTTP GET probes, which perform a GET request to a specified URL and check the response code to determine the container's liveness.
2. TCP socket probes, which attempt to open a TCP connection to a specified port on the container and check for a successful connection.
3. Command execution probes, which run a specified command inside the container and check the exit code to determine the container's liveness.

> Each of these types of probes can be customized to fit the specific needs of the application running in the container.

- **Readiness** probes are similar to liveness probes, but they are used to check if a container is ready to receive traffic. If a container is not ready, Kubernetes will **not send it any traffic**.
> This can be useful for ensuring that the application has fully started up and is able to handle requests.

The ways to implement readiness probes are the same as the liveness probes.

**IMPORTANT NOTES**:
- Using Liveness and Readiness at the same time can potentially lead to a `CrashLoopBackOff` error, especially when using the `initialDelaySeconds` option for the Readiness probe. This is because the Liveness probe can fail before the Readiness probe succeeds, which will cause the container to be restarted. So, it will cause a loop of restarts.
> A possible fix for this is to define the same `initialDelaySeconds` value for both Liveness and Readiness probes. However, if the container fails at some point later, and the Liveness probe runs before the Readiness probe, the container will be restarted again, and the Readiness probe will not be able to succeed, which will cause a loop of restarts again. And a fix for this could be to define a higher value for the `initialDelaySeconds` option for the Liveness probe.
> All those fixes are not ideal, in fact, they are just workarounds, since in a real-world scenario, we usually don't know how long it will take for the container to start up and be ready to receive traffic, this time can vary a lot depending on the application.
> To solve those problems, we can use the Startup probe, which was introduced in Kubernetes 1.16 to address those issues and provide a better and definitive solution.

- **Startup** probes are used to check if a container has started up successfully. Basically, it works **like a Readiness probe**, but it is only run **once**, when the container starts up. When a Startup probe is defined, the Liveness and Readiness probes are not run until the Startup probe succeeds.
> This is useful for applications that take a long time to start up, and don't have a fixed start-up time.

The ways to implement startup probes are the same as the liveness and readiness probes.

## Resources and HPA

### metrics-server

In order to use the Horizontal Pod Autoscaler (HPA), we must install the metrics-server. It is a component that collects metrics from the nodes and exposes them to the API server. Usually, it is installed by default in the cluster in the cloud providers. But, in the case of Minikube, or Kind for example, we must install it manually.

The installation guide can be found in [this GitHub repository](https://github.com/kubernetes-sigs/metrics-server).

> 

## Statefulsets and persistent volumes

## Ingress

The LoadBalancer service type generates an external IP address that is accessible from outside the cluster.
However, in a microservices architecture, we can have multiple services. So, we can have multiple external IP addresses, and this is not ideal. The cost of having multiple load balancers is also high.

In order to solve this problem, we can use an Ingress. It is a component that runs in the cluster and it is responsible for routing the traffic to the correct service, acting as an entry point for the application.
Using Ingress, we can have a single external IP address, and a single load balancer.

When using Ingress, all the services must be exposed using a `ClusterIP` service type. Therefore, the cost for maintaining the services is lower.
> Regarding the service type, once created, it is not possible to change the service type. So, if we want to change the service type, we must delete the service and create a new one.

### Ingress Controller

In order for the Ingress resource to work, the cluster must have an ingress controller running.
Ingress controllers are not started automatically with a cluster (unlike other types of controllers). So, we must install an ingress controller implementation manually.

One of the most popular ingress controllers is the Nginx ingress controller. And the easiest way to install it is by using the Helm package manager.

> The default installation using Helm will install the ingress controller in the default namespace. Which is not recommended. The ideal way is to install it in a dedicated namespace.

After the Nginx ingress controller installation, we can see that it created a new service of type `LoadBalancer`. And if the k8s cluster is running in a cloud provider, it will also create an external IP address. Besides, it should also create a new pod for the ingress controller.

The Ingress rules are defined using YAML manifests as well. Including the annotations, which are used to define third-party especific configurations (Nginx in this case).

## kubectl commands

- `kubectl config get-clusters`: List all clusters in the kubeconfig file.
- `kubectl config get-contexts`: List all contexts.
- `kubectl config use-context <context-name>`: Set the specified context as the active one.
- `kubectl get nodes`: List all nodes in the cluster.
- `kubectl get pods`: List all pods in the current namespace.
- `kubectl get pods -n <namespace>`: List all pods in the specified namespace.
- `kubectl get pods -o wide`: List all pods in the current namespace, including additional information.
- `kubectl apply -f <file-name>`: Create **or update** resources (pods, deployments, services, etc) based on the configuration in the specified file.
- `kubectl describe pod <pod-name>`: Show detailed information about a pod.
- `kubectl logs <pod-name>`: Show the logs of a pod.
- `kubectl exec -it <pod-name> -- <command>`: Execute a command inside a pod.
- `kubectl port-forward <pod-name> <local-port>:<pod-port>`: Forward a local port to a port in a pod (usually used for testing/debugging purposes).
- `kubectl get services`: List all services in the current namespace.
- `kubectl get deployments`: List all deployments in the current namespace.
- `kubectl get ingress`: List all ingresses in the current namespace.
- `kubectl get all`: List all resources in the current namespace.
- `kubectl get all -n <namespace>`: List all resources in the specified namespace.
- `kubectl get all -A`: List all resources in all namespaces.
- `kubectl delete pod <pod-name>`: Delete a pod.
- `kubectl delete service <service-name>`: Delete a service.
- `kubectl delete deployment <deployment-name>`: Delete a deployment.
- `kubectl delete ingress <ingress-name>`: Delete an ingress.

> Some examples of k8s YAML manifests can be found [here](https://github.com/devfullcycle/fc-k8s).

## Rollback

When we update a deployment, k8s will create a new ReplicaSet, and will start creating new pods with the new configuration. But the old ReplicaSet will still be there, however, withoud any pods. So, it is possible to rollback to a previous version of the deployment.

To rollback to the last version of the deployment, we can use the `kubectl rollout undo deployment <deployment-name>` command.

To rollback to a specific version of the deployment, we can use the `kubectl rollout undo deployment <deployment-name> --to-revision=<revision-number>` command.

To see the history (versions) of the deployment, we can use the `kubectl rollout history deployment <deployment-name>` command.
