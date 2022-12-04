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
- **LoadBalancer**: Exposes the service externally using a cloud provider's load balancer. In order to achieve this, it also creates a `ClusterIP` service, and a `NodePort` service.

![k8s-svc](https://user-images.githubusercontent.com/40317398/205502618-eeccd3dd-6001-4a17-b3df-862984895f69.png)

> An **Ingress** resource can also be used to expose the services.

When listing the services, we can see that there is also another service called `kubernetes`. This service is created by default and it is used to expose the API server in the cluster.

Each service has an IP address, and the services are accessible (**from inside the cluster**) using this IP address, or using the service name, which is more common.

In order to test the services, we can use the `port-forward` command, but as already mentioned, this is not recommended for production environments: `kubectl port-forward service/<service-name> 8000:<service-port> -n <namespace>` (in this example, the service will be accessible in the port 8000).

Inside the service definition, we can also define the `port` and the `targetPort`. The `port` is the port that the service will be exposed, and the `targetPort` is the port that the container will be accessible.
By defining the `targetPort`, the service will redirect the requests to the container port, when the `targetPort` is not defined, the service will redirect the requests to the same port that the service is exposed (`port`).

It is also possible to create a proxy to the service, using the `kubectl proxy` command. This will create a proxy to the API server, and the services will be accessible for example in the `localhost:8080`, like `kubectl proxy --port=8080`.

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
