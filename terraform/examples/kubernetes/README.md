[Back](../README.md)

# Creating a Kubernetes Cluster with Terraform on AWS

Most people use the default VPC when creating resources on AWS. However, it's not recommended to use the default VPC in production, because it's not secure. Instead, we should create a new VPC, and then create resources in that VPC.

AWS creates a default VPC that was meant to be used for all kinds of applications, which means that everything is available to the public, all subnets are associated with a route table that has a route to the internet gateway, and all instances have a public IP address. Besides that, the default VPC has a default security group that allows all inbound and outbound traffic.

For this reason, when should create a new VPC, tailored to our needs, and then create resources in that VPC.

## AWS VPC basics

A VPC is a virtual network (virtual private cloud) that we can create on AWS. We can create subnets, route tables, internet gateways, and more inside a VPC.

- **VPC**: A virtual private cloud (VPC) is a virtual network dedicated to our AWS account.
- **Subnet**: A subnet is a range of IP addresses in our VPC. We can launch AWS resources into a specified subnet. Use a public subnet for resources that must be connected to the internet, and a private subnet for resources that won't be connected to the internet. Each subnet must reside entirely within one Availability Zone (AZ), and we can have multiple subnets in a VPC.
- **Route table**: A route table contains a set of rules, called routes, that are used to determine where network traffic is directed. Each subnet in our VPC must be associated with a route table; the table controls the routing for the subnet.
- **Internet gateway**: An internet gateway is a VPC component that allows communication between our VPC and the internet.

> AZs on AWS are different from regions. A region is a physical location in the world, and an AZ is one or more discrete data centers, each with redundant power, networking, and connectivity, located in a region. (Each region has multiple AZs.).

## Setting up AWS CLI

The first step after creating a new AWS account is to create an IAM user, and then configure the AWS CLI to use that IAM user.

> IAM stands for Identity and Access Management. IAM allows us to manage users and their level of access to the AWS console.
> It's not recommended to use the root user to access the AWS console, because it has full access to all AWS services and resources in the account.

### Creating an IAM user

Create an IAM user on AWS is very simple. We just need to go to the IAM service, and then click on the "Add user" button, and them assign the permissions that we want to that user.

### Configuring the AWS CLI

After creating an IAM user, we need to configure the AWS CLI to use that IAM user.

> You need to have the AWS CLI installed on your machine to be able to run the `aws` command. You can install the AWS CLI by following the instructions on the AWS documentation.

To configure the AWS CLI, we can run the `aws configure` command, and then enter the access key ID, the secret access key, the default region name, and the default output format.

```bash
aws configure
```

The AWS CLI credentials are stored in the `~/.aws/credentials` file, and the default region and output format are stored in the `~/.aws/config` file.

> Terraform uses the AWS CLI credentials to authenticate with AWS.
