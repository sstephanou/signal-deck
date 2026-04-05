resource "aws_vpc" "signal_deck" {
  cidr_block = var.vpc_cidr
  tags       = { Name = "signal-deck-vpc" }
}

resource "aws_subnet" "signal_deck_public" {
  vpc_id                  = aws_vpc.signal_deck.id
  cidr_block              = var.public_subnet_cidr
  map_public_ip_on_launch = true

  tags = { Name = "signal-deck-subnet" }
}

resource "aws_internet_gateway" "signal_deck" {
  vpc_id = aws_vpc.signal_deck.id

  tags = { Name = "signal-deck-internet-gateway" }
}

resource "aws_route_table" "signal_deck_public" {
  vpc_id = aws_vpc.signal_deck.id

  tags = { Name = "signal-deck-public-route" }
}

resource "aws_route" "signal_deck_internet" {
  route_table_id         = aws_route_table.signal_deck_public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.signal_deck.id
}

resource "aws_route_table_association" "signal_deck_assoc" {
  subnet_id      = aws_subnet.signal_deck_public.id
  route_table_id = aws_route_table.signal_deck_public.id
}

resource "aws_security_group" "signal_deck" {
  vpc_id = aws_vpc.signal_deck.id

  # TODO: open later as needed
  ingress = []

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
