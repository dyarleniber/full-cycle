[Back](../README.md)

# Terraform

Terraform is a tool for building, changing, and provisioning infrastructure safely and efficiently. Terraform can manage existing and popular service providers.

## Idempotence

Terraform is idempotent. This means that if you run the same Terraform code multiple times, the result will be the same. If you run Terraform code that has already been applied, Terraform will not make any changes.

Idempotence is a key feature of Terraform. It allows you to run Terraform code multiple times without worrying about the state of your infrastructure.

## Declarative vs Imperative

Terraform is declarative. This means that you describe the desired state of your infrastructure, and Terraform will make the necessary changes to achieve that state.

Terraform is not imperative. This means that you do not tell Terraform how to make the changes. You only tell Terraform what changes to make.

Terraform uses HCL (HashiCorp Configuration Language) to define the desired state of your infrastructure. HCL is a declarative language that is used to describe the desired state of your infrastructure.

## Terraform vs Ansible

Terraform is mainly used for provisioning infrastructure, where the idempotence is important. However, for other tasks, such as configuration management, Ansible is a better choice, because it is imperative, and we do not need idempotence.

To summarize:

- Terraform is mainly used for provisioning infrastructure, and Ansible is mainly used for configuration management.
- Terraform is idempotent, and Ansible is not idempotent.
- Terraform is declarative, and Ansible is imperative.

> Note: Terraform is not a replacement for Ansible. They are complementary tools that can be used together.
> But, if needed, Terraform can also be used for configuration management, even though Ansible is usually more suitable for this task.

Let's see an example of how Terraform and Ansible can be used together:

Imagine that we have to provision 50 servers on AWS, and we want to install and configure Nginx on all of them.

In this case, we can use Terraform to provision the servers on AWS, declaring the desired state of our infrastructure, and then we can use Ansible to set the instructions for installing and configuring Nginx on all of them.

## State

Terraform uses a state file (`terraform.tfstate`) to keep track of the resources that it manages.
This file is extremely important, because it contains all the information about the current state of your infrastructure. It's based on the state file that Terraform knows what changes to make to your infrastructure, if a certain resource needs to be added, changed, or destroyed.

This file can be stored remotely, for example in an S3 bucket, or locally, in the same directory where you run Terraform commands.

Having the state file stored remotely is the recommended way to use Terraform, because it allows you to share the state of your infrastructure with your team, and it also allows you to use Terraform in a CI/CD pipeline.

> Besides the `terraform.tfstate` file, Terraform also creates a `terraform.tfstate.backup` file, which is a backup of the previous state file. This file is used to restore the state file if the state file becomes corrupted.

## Registry and Providers

Terraform uses providers to interact with different infrastructure providers, such as AWS, Azure, GCP, etc.

And all the providers are available in the [Terraform Registry](https://registry.terraform.io/). There are 3 types of providers:

- Official providers: maintained by HashiCorp.
- Verified providers: maintained by a third-party, but verified by HashiCorp.
- Community providers: maintained by a third-party.

You can check the documentation of a provider in the Terraform Registry, as well as some examples of how to use it.

### Resources

Terraform uses resources to represent infrastructure objects, such as servers, databases, networks, etc.

For example, if we want to create a S3 bucket on AWS, we can use the `aws_s3_bucket` resource from the AWS provider.

## Commands

- `terraform init`: Initialize a working directory containing Terraform configuration, which includes downloading providers and modules.
- `terraform plan`: Create an execution plan.
- `terraform apply`: Apply changes to the infrastructure.

## Variables

Terraform uses variables to parameterize your code. Variables allow you to reuse the same code with different values, depending on the environment.

We can define variables in a `variables.tf` file, and then we can use them in our code.

```hcl
variable "region" {
  type = string
  default = "us-east-1"
  description = "The AWS region to deploy to"
}
```

> When defining a variable, we can specify the type of the variable, and also a default value and a description.

> When we don't specify a default value for a variable, and we don't pass a value to it, Terraform will prompt us to enter a value when we run a Terraform command.

```hcl
provider "aws" {
  region = var.region
}
```

There are some ways to set the value of a variable:

- Using a `terraform.tfvars` file, which is automatically loaded by Terraform.
- Using the `-var` flag when running Terraform commands. For example: `terraform plan -var="region=us-east-1"`.
- Using the `-var-file` flag when running Terraform commands. For example: `terraform plan -var-file="dev.tfvars"` (`terraform.tfvars` is automatically loaded by Terraform, however, if we want to use a different file, we can use the `-var-file` flag. This is useful when we have multiple environments, such as dev, staging, and production).
- Using environment variables. For example: `export TF_VAR_region=us-east-1` (the name of the environment variable must start with `TF_VAR_` followed by the name of the variable).

## Outputs

Terraform uses outputs to display information about the resources that it manages.

We can define outputs in a `outputs.tf` file, and then we can use them in our code.

```hcl
output "bucket_name" {
  value = aws_s3_bucket.bucket.id
  description = "The name of the S3 bucket"
}
```

## Data Sources

Besides resources, the Terraform providers can also expose data sources.

Terraform uses data sources to fetch information about the resources that it manages.

For example, if we want to create a S3 bucket on AWS, we can use the `aws_s3_bucket` resource from the AWS provider. However, if we want to create a S3 bucket on AWS, and we want to use the name of an existing S3 bucket, we can use the `aws_s3_bucket` data source from the AWS provider.

```hcl
data "aws_s3_bucket" "bucket" {
  bucket = "my-bucket"
}
```

We can now use this data source to get the name of the existing S3 bucket.

```hcl
resource "aws_s3_bucket" "bucket" {
  bucket = data.aws_s3_bucket.bucket.id
}
```
