# AWS Infrastructure (Terraform)

## Overview
This is a small Terraform setup for running a containerised app on AWS.

It creates a basic environment with a single EC2 instance, pushes images via ECR using GitHub Actions. Access to the instance is handled through SSM.

## What it sets up

- A VPC with a public subnet and internet access  
- One EC2 instance with Docker installed  
- Two ECR repositories (backend + frontend)  
- GitHub Actions → AWS auth using OIDC  

## How it’s intended to be used

This is meant to be simple and easy to work with:

- Build and push images from GitHub Actions  
- Pull and run them on the EC2 instance  
- Connect to the instance via SSM when needed  

## Design choices

**No SSH**  
SSM is used instead, so there are no open ports or key management to deal with.

**OIDC over access keys**  
GitHub Actions assumes an AWS role directly. No long-lived credentials in the repo.

**Keep it simple**  
This is a starting point, not production infrastructure.

## State

Terraform state is stored in S3.

The bucket is created separately and should have:
- encryption enabled  
- public access blocked  

## Usage

```bash
terraform init
terraform apply
```
