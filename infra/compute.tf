data "aws_ssm_parameter" "ami" {
  name = var.instance_image
}

resource "aws_instance" "signal_deck" {
  ami           = data.aws_ssm_parameter.ami.value
  instance_type = var.instance_type

  subnet_id              = aws_subnet.signal_deck_public.id
  vpc_security_group_ids = [aws_security_group.signal_deck.id]

  metadata_options {
    http_tokens = "required"
  }

  iam_instance_profile = aws_iam_instance_profile.ssm_profile.name

  associate_public_ip_address = true

  tags = { Name = "signal-deck-ec2" }
  user_data = <<-EOF
    #!/bin/bash
    dnf install -y docker
    systemctl start docker
    systemctl enable docker
    usermod -aG docker ec2-user
  EOF
}

resource "aws_ecr_repository" "backend" {
  name = "signal-deck-backend"

  encryption_configuration {
    encryption_type = "AES256"
  }
}

resource "aws_ecr_repository" "frontend" {
  name = "signal-deck-frontend"

  encryption_configuration {
    encryption_type = "AES256"
  }
}
