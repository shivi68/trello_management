Trello Management Web Application

Overview

This is a Web Application for task management and is deployed to a Kubernetes cluster using kubectl. The application is Dockerized and exposed externally using a Kubernetes Service.

Requirements

- Kubernetes cluster (local or cloud-based)
- Docker
- Basic knowledge of containers and Kubernetes concepts

Setup and Deployment

1. Dockerize the Application
    - Create a Dockerfile to build the Docker image
    - Build the Docker image using docker build -t shivi168/trello_manegement_system:1.0 
    - Run the Docker image using docker run -p 8080:8080 shivi168/trello_manegement_system:1.0 
2. Push the Docker Image to Docker Hub
    - Push the Docker image to Docker Hub using docker push shivi168/trello_manegement_system:1.0 
3. Create Kubernetes Deployment and Service YAML Files
    - Create deployment.yaml and service.yaml files to define the deployment and service configurations
4. Start Minikube
    - Start Minikube using minikube start
5. Apply Deployment and Service Configurations
    - Apply the deployment configuration using kubectl apply -f deployment.yaml
    - Apply the service configuration using kubectl apply -f service.yaml
6. Start Minikube Tunnel
    - Start the Minikube tunnel to access the application externally using minikube tunnel
7. Verify Deployment
    - Verify the deployment using kubectl get pods and kubectl get services

Scaling the Application

1. Scale the Deployment
    - Scale the deployment to 10 replicas using kubectl scale deployment app-deployment --replicas=10

Bonus Points: Health Check Endpoint and Probes

1. Update Deployment YAML File
    - Update the deployment.yaml file to add a health check endpoint and configure liveness and readiness probes
2. Apply Updated Deployment File
    - Apply the updated deployment file using kubectl apply -f deployment.yaml
3. Verify Probes
    - Verify the probes using kubectl describe pod app-deployment-798b6674f-gr7qg

GitHub Repository

This project is hosted on GitHub at 
https://github.com/shivi68/trello_management.git
