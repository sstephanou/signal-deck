variable "region" {
  type        = string
  default     = "eu-west-2"
  description = "Target AWS region"
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  type    = string
  default = "10.0.1.0/24"
}

variable "instance_type" {
  type    = string
  default = "t4g.small"
}

variable "instance_image" {
  type    = string
  default = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-6.1-arm64"
}

variable "github_owner" {
  type    = string
  default = "sstephanou"
}

variable "github_repo" {
  type    = string
  default = "signal-deck"
}

variable "github_branch" {
  type    = string
  default = "master"
}
