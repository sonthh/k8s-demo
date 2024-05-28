# Minikube and Argo CD Setup Guide

This guide will walk you through the setup of Minikube, Kubernetes, and Argo CD on macOS, along with deploying a sample application using Docker and Argo CD.

## Prerequisites

- [Homebrew](https://brew.sh/) installed on your system.
- [Docker](https://docs.docker.com/get-docker/) installed and configured.
- Basic knowledge of Kubernetes, Minikube, and Docker.

## Step 1: Install Minikube

First, install Minikube using Homebrew.

```bash
brew install minikube
brew unlink minikube
brew link minikube
```

For detailed installation instructions, visit the Minikube [documentation](https://minikube.sigs.k8s.io/docs/start).

## Step 2: Install kubectl

Next, install kubectl, the command-line tool for interacting with your Kubernetes cluster.

```bash
brew install kubectl
kubectl version --client
kubectl get ns
```

For more information, refer to the [Kubernetes documentation](https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/).

### Step 3: Trusting Untrusted Certificates

If you are using a self-signed certificate, follow these steps to trust it with Minikube:

```bash
openssl x509 -in menlo-root-cert.pem.cer -out menlo-root-cert.pem
mkdir -p $HOME/.minikube/certs
cp menlo-root-cert.pem $HOME/.minikube/certs/menlo-root-cert.pem
```

Refer to the [Minikube handbook](https://minikube.sigs.k8s.io/docs/handbook/untrusted_certs/) for more details.

### Step 4: Start Minikube

Delete any existing Minikube cluster and start a new one with embedded certificates:

```bash
minikube delete
minikube start --embed-certs
```

### Step 5: Check Logs and Status

Use the following commands to check the status of your Argo CD installation and Kubernetes resources:

```bash
kubectl get events -n argocd
kubectl describe pod -n argocd
kubectl config current-context
kubectl get all --namespace argocd
```

### Step 6: Install Argo CD

Create a namespace for Argo CD and apply the installation manifests:

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Install the Argo CD CLI:

```bash
brew install argocd
```

For more details, refer to the [Argo CD getting started guide](https://argo-cd.readthedocs.io/en/stable/getting_started/).

### Step 7: Expose Argo CD Server

To access the Argo CD UI, expose the Argo CD server:

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
argocd admin initial-password -n argocd
```

You can also use a LoadBalancer service (optional):

```bash
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'
```

### Step 8: Docker Setup

Log in to Docker, build your image, and push it to Docker Hub:

```bash
docker login -u sonthh98
docker build -t k8s-demo .
docker tag k8s-demo sonthh98/k8s-demo:latest
docker push sonthh98/k8s-demo:latest
```

### Step 9: Deploy Your Application with Argo CD

Add your Git repository to Argo CD:

```bash
argocd login localhost:8080 --username admin --password <password> --grpc-web
argocd repo add git@github.com:sonthh/k8s-demo.git --ssh-private-key-path ~/.ssh/id_ed25519_son
```

Apply the Kubernetes configuration to deploy your application:

```bash
kubectl apply -f k8s/app-dev.yml
```

### Step 10: Access Your Application

To access your deployed application, use port forwarding:

```bash
kubectl port-forward -n default svc/k8s-demo-svc 5000:5000
```

Now, you should be able to access your application on http://localhost:5000.

### Conclusion

You have successfully set up Minikube, Kubernetes, and Argo CD, and deployed a sample application. For more information on each tool, please refer to their respective documentation.
