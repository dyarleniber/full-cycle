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

- **Pods**: They are the smallest deployable units in k8s. It contains one or more containers, usually one container per pod.

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

In local clusters using Minikube or Kind for example, the default installation of the metrics-server will not work due to some security issues. So, we must change the YAML configuration file to allow insecure access to the metrics-server.

Basically, the default installation is done by applying the following command:

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

In order to allow insecure access to the metrics-server, we must add `- --kubelet-insecure-tls` to the `args` option in the `Deployment` section of the YAML configuration file, as follows:

```yaml
args:
  - --cert-dir=/tmp
  - --secure-port=4443
  - --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname
  - --kubelet-insecure-tls
```

After installing the metrics-server, we can check if it is running, by listing the api services:

```bash
kubectl get apiservices
```

The metrics-server should be listed in the output as `v1beta1.metrics.k8s.io` with the available status as `True`.

### Resources

In order to define the resources that a pod can use, we can use the `resources` option in the pod definition. It is defined as follows:

```yaml
resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 500m
    memory: 512Mi
```

- `requests` is the **minimum** amount of resources that the pod can use.
- `limits` is the **maximum** amount of resources that the pod can use.

Both `requests` and `limits` are optional. If we don't define them, the pod will be able to use all the resources available in the node.
For each resource, we can define the amount of CPU and memory that the pod can use.

- `cpu` is the amount of CPU that the pod can use. It is defined in millicores.

  > In Kubernetes, each node in a cluster has a certain amount of CPU capacity available, and this capacity can be divided among the pods running on that node, 1 CPU core is equal to 1000 millicores.
  > So, 500m is equal to 0.5 CPU core (half of a CPU core).
  > We can also use 0.5 as the value for the `cpu` option, which is equal to 500m.

- `memory` is the amount of memory that the pod can use. It is defined in bytes, where 1 Mi is equal to 1048576 bytes.
  > We can use the suffixes `Ki`, `Mi`, `Gi`, `Ti`, `Pi`, `Ei`, and so on to define the amount of memory in kilobytes, megabytes, gigabytes, terabytes, petabytes, exabytes, and etc.

#### Important note

Always try to prevent the sum of all limits from exceeding the amount of resources in the cluster. Otherwise, the pods will not be able to be scheduled.
This is a security measure to ensure that all the pods in the cluster can be scheduled. However, we can end up paying more for the resources that we are not using.

### HPA (Horizontal Pod Autoscaler)

The Horizontal Pod Autoscaler (HPA) is a component that automatically scales the number of pods in a deployment based on the CPU usage of the pods.

> It's also possible to scale based on the other metrics, but the CPU usage is the most common.

In order to create an HPA, we must create a YAML configuration file, as follows:

```yaml
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: hpa-example
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: hpa-example
  minReplicas: 2
  maxReplicas: 5
  targetCPUUtilizationPercentage: 75
```

In the above configuration file, we have the following options:

- `scaleTargetRef` is the reference to the deployment that we want to scale.
- `minReplicas` is the minimum number of replicas that the deployment can have.
- `targetCPUUtilizationPercentage` is the target CPU utilization percentage. It is the percentage of CPU usage that the pods must have in order to scale up the deployment. If the CPU usage is lower than the target CPU utilization percentage, the deployment will be scaled down.

To get the CPU usage of the pods, we can use the following command:

```bash
kubectl top pods
```

And to get the HPA, we can use the following command:

```bash
kubectl get hpa
```

#### Stress test

In order to test the HPA, we can use [Fortio](https://github.com/fortio/fortio). It is a load testing tool that can be used to generate load on a service, even in a local cluster.

We can easily expose the service locally, then use create a pod with Fortio and use it to generate load on the service.

First, we must expose the service locally, using the following command:

```bash
kubectl port-forward service/hpa-example 8080:80
```

Then, we can create a pod with Fortio, using the following command:

```bash
kubectl run -it fortio --rm --image=fortio/fortio -- load -qps 800 -t 120s -c 70 "http://localhost:8080/healthz"
```

The above command will create a pod with Fortio and use it to generate load on the service. The load will be generated by 70 concurrent connections, with a rate of 800 requests per second, for 120 seconds.
The pod will be deleted after the load test is finished.

To see the CPU usage of the pods, we can use the following command:

```bash
watch -n 1 kubectl get hpa
```

The above command will run the `kubectl get hpa` command every second, and it will show the CPU usage of the pods.

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

The Ingress rules are defined using YAML manifests as well. Including the annotations, which are used to define third-party specific configurations (Nginx in this case).

## Cert Manager

The Cert Manager is a component that automates the management and issuance of TLS certificates from various certificate authorities, including Let's Encrypt.

> TLS is the abbreviation for Transport Layer Security. It is a protocol that provides security for network communications. It is used to encrypt the data that is sent over the network.

One way to use TLS is to set the TLS configuration in the Ingress definition. However, with the Cert Manager, we can automate the process of issuing TLS certificates, and renewing them when they expire.

### Installation

The installation steps are described in the official documentation](https://cert-manager.io/docs/installation/). It is recommended to install the Cert Manager in a dedicated namespace.

### Issuers

The Issuers are the components that are responsible for issuing the certificates. In order to issue a certificate for the whole cluster, we must use a ClusterIssuer, which is a cluster-wide resource that can be used by any namespace.

The Issuers are defined using YAML manifests. The following is an example of a ClusterIssuer:

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
  namespace: cert-manager
spec:
  acme:
    email: <email>
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
      - http01:
          ingress:
            class: nginx
```

In the above configuration file, we have the following options:

- `spec.acme.email`: The email address that will be used to register with Let's Encrypt.
- `spec.acme.server`: The URL of the ACME server that will be used to issue the certificates.
- `spec.acme.privateKeySecretRef.name`: The name of the secret that will be used to store the private key.
- `spec.acme.solvers`: The list of solvers that will be used to solve the ACME challenges. In this case, we are using the HTTP01 challenge, which requires the ingress controller to expose a specific path in order to validate the challenge.

> `acme` is the ACME protocol, which is used to issue certificates. It is a protocol that is used to automate the process of issuing certificates. It is used by Let's Encrypt, but it can also be used by other certificate authorities.

Now, in the ingress definition, we can use the following annotations:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: hpa-example
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    ingress.kubernetes.io/force-ssl-redirect: "true"
spec:
  tls:
    - hosts:
        - mydomain.com
      secretName: letsencrypt-prod
  rules:
    - host: mydomain.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: my-service
                port:
                  number: 80
```

> `ingress.kubernetes.io/force-ssl-redirect`: This annotation is optional. It is used to force the redirection from HTTP to HTTPS.

> Remember to set up the DNS records for the domain name.

We can check the status of the certificate using the following command:

```bash
kubectl get certificates
```

or

```bash
kubectl describe certificate letsencrypt-prod
```

## Namespaces

Namespaces are used to organize the resources in the cluster. They are used to group resources by project, environment, team, etc.
When we don't specify a namespace, the resources are created in the default namespace.

Namespaces are useful when we want to isolate the resources. For example, we can have more CPU and memory resources in the production namespace, and less resources in the development namespace. Also different security policies can be applied to specific namespaces.

> We can use a different namespace for each environment (development, staging, production, etc). But in general, it is more appropriate to use a different cluster for each environment.

## Contexts

Contexts are used to define the connection to the cluster. They are used to define the cluster, the user, and the namespace that will be used by default.

The contexts are defined in the kubeconfig file. The kubeconfig file is located in the `~/.kube` directory. It is a YAML file that contains the information about the clusters, users, and contexts.

Normally, contexts are used to switch between clusters. But we can also use them to switch between namespaces.
This is really useful when we are working different environments (development, staging, production, etc) in the same cluster, or any other situation where we want to avoid applying changes to the wrong namespace.

> As mentioned before, it is recommended to use a different cluster for each environment.

In order to create a new context with a specific namespace, we can use the following command:

```bash
kubectl config set-context dev --cluster=dev --user=dev --namespace=dev
```

```bash
kubectl config set-context prod --cluster=prod --user=prod --namespace=prod
```

Now, we can use the following command to switch between contexts:

```bash
kubectl config use-context dev
```

## Service Accounts

When we deploy an application in Kubernetes, this application needs to have a permission to access the Kubernetes API. This is done using a Service Account, and based on the permissions that are defined for this Service Account, the application will be able to access the Kubernetes API to create, update, delete, etc the resources that are required by the application.

Having said that, let's say that this application has a critical vulnerability which allows the attacker to access the Kubernetes API. If the Service Account that is used by the application has the permission to access all the resources in the cluster, the attacker will be able to do anything in the cluster.

Kubernetes has a default Service Account that is used by all the applications that are deployed in the cluster. This Service Account has the permission to access all the resources in the cluster. This is not a good practice, and it is recommended to create a new Service Account with the minimum permissions required by the applications.

We can check the service accounts using the following command:

```bash
kubectl get serviceaccounts
```

### How to access the Kubernetes API credentials from a pod

When we deploy an application in Kubernetes, in addition to the pods, Kubernetes also creates a default volume based on the Service Account secret. This volume is mounted in the `/var/run/secrets/kubernetes.io/serviceaccount` directory. This volume contains the following files:

- `ca.crt`: The certificate authority certificate.
- `namespace`: The namespace that the pod is running in.
- `token`: The token that is used to access the Kubernetes API.

We can check this by describing the pod:

```bash
kubectl describe pod <pod-name>
```

And accessing the pod using the following command:

```bash
kubectl exec -it <pod-name> -- bash
```

Now, we can check the content of the `/var/run/secrets/kubernetes.io/serviceaccount` directory:

```bash
ls /var/run/secrets/kubernetes.io/serviceaccount
```

So, if we do not use a custom Service Account, the files described above will allow full access to the Kubernetes API, allowing to delete, update, create, etc all the resources in the cluster.

### Creating a custom Service Account with limited permissions

In order to create a custom Service Account, we can use the following YAML manifest:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-service-account
```

#### RBAC

RBAC is a Kubernetes feature that allows us to define the permissions that are granted to a Service Account. It stands for Role-Based Access Control.

To create a new Role, we can use the following YAML manifest:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: my-role
rules:
  - apiGroups: [""]
    resources: ["pods", "services"]
    verbs: ["get", "watch", "list"]
  - apiGroups: ["apps"]
    resources: ["deployments"]
    verbs: ["get", "watch", "list"]
```

> `apiGroups`: The API group that contains the resource.

We can check the API resources using the following command:

```bash
kubectl api-resources
```

As we can see, there are some resources that are not part of any API group. For example, the `pods` resource. In this case, we can use an empty string as the API group. But for the `deployments` resource, we need to use the `apps` API group.

> `resources`: The resources that the role has access to.
> `verbs`: The operations that the role is allowed to perform.

#### RoleBinding

In order to bind a Role to a Service Account, we can use the following YAML manifest:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: my-service-account-read-binding
subjects:
  - kind: ServiceAccount
    name: my-service-account
    namespace: default
roleRef:
  kind: Role
  name: my-role
  apiGroup: rbac.authorization.k8s.io
```

Finally, after creating the Service Account, Role, and RoleBinding, we can attach the Service Account to a deployment as follows:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      serviceAccountName: my-service-account
      containers:
        - name: my-container
          image: nginx
```

The `serviceAccountName` property specifies the Service Account that is used by the pod.

#### ClusterRole

A ClusterRole is a Role that is not bound to a specific namespace. It can be used to grant access to all the resources in the cluster.

For example, in the previous Role example, that Role can only be used in the `default` namespace. If we want to use the same Role in another namespace, we need to create a new Role with the same permissions.

But, if we want to use the same Role in all the namespaces, we can use a ClusterRole instead.

The process of creating a ClusterRole is the same as creating a Role. The only difference is that we need to use the `ClusterRole` kind instead of the `Role` kind. And a `ClusterRoleBinding` instead of a `RoleBinding`.

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

When we update a deployment, k8s will create a new ReplicaSet, and will start creating new pods with the new configuration. But the old ReplicaSet will still be there, however, without any pods. So, it is possible to rollback to a previous version of the deployment.

To rollback to the last version of the deployment, we can use the `kubectl rollout undo deployment <deployment-name>` command.

To rollback to a specific version of the deployment, we can use the `kubectl rollout undo deployment <deployment-name> --to-revision=<revision-number>` command.

To see the history (versions) of the deployment, we can use the `kubectl rollout history deployment <deployment-name>` command.
