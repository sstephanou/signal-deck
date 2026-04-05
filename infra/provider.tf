terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.39.0"
    }
  }

  backend "s3" {
    bucket = "remote-state-979277815249-eu-west-2-an"
    key    = "terraform/aws"
    region = "eu-west-2"
  }
}

provider "aws" {}
