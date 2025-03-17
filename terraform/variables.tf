variable "aws_region" {
  description = "The AWS region to deploy into"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "The environment (development, staging, production)"
  type        = string
  default     = "development"
}

variable "app_name" {
  description = "The name of the application"
  type        = string
  default     = "ai-tutor-lms"
}

variable "domain_name" {
  description = "The domain name for the application"
  type        = string
  default     = "example.com"
}

# VPC Configuration
variable "vpc_cidr" {
  description = "The CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "The availability zones to use"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

variable "public_subnet_cidrs" {
  description = "The CIDR blocks for the public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "private_subnet_cidrs" {
  description = "The CIDR blocks for the private subnets"
  type        = list(string)
  default     = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]
}

# ECS Configuration
variable "container_port" {
  description = "The port the container will listen on"
  type        = number
  default     = 4000
}

variable "container_cpu" {
  description = "The number of CPU units to reserve for the container"
  type        = number
  default     = 256
}

variable "container_memory" {
  description = "The amount of memory to reserve for the container"
  type        = number
  default     = 512
}

variable "instance_count" {
  description = "The number of instances to run"
  type        = number
  default     = 2
}

variable "health_check_path" {
  description = "The path for the health check"
  type        = string
  default     = "/api/health"
}

variable "ecr_repository_name" {
  description = "The name of the ECR repository"
  type        = string
  default     = "ai-tutor-lms-api"
}

# AI Service Configuration
variable "ai_service_container_port" {
  description = "The port the AI service container will listen on"
  type        = number
  default     = 4001
}

variable "ai_service_container_cpu" {
  description = "The number of CPU units to reserve for the AI service container"
  type        = number
  default     = 512
}

variable "ai_service_container_memory" {
  description = "The amount of memory to reserve for the AI service container"
  type        = number
  default     = 1024
}

variable "ai_service_ecr_repository_name" {
  description = "The name of the ECR repository for the AI service"
  type        = string
  default     = "ai-tutor-lms-ai-service"
}

variable "openai_api_key_arn" {
  description = "The ARN of the Secrets Manager secret containing the OpenAI API key"
  type        = string
  default     = ""
}

# Database Configuration
variable "db_instance_class" {
  description = "The instance class for the RDS instance"
  type        = string
  default     = "db.t3.small"
}

variable "db_name" {
  description = "The name of the database"
  type        = string
  default     = "ai_tutor_lms"
}

variable "db_username" {
  description = "The username for the database"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "The password for the database"
  type        = string
  sensitive   = true
}

# Storage Configuration
variable "video_bucket_name" {
  description = "The name of the S3 bucket for video storage"
  type        = string
  default     = "ai-tutor-lms-videos"
}

variable "assets_bucket_name" {
  description = "The name of the S3 bucket for static assets"
  type        = string
  default     = "ai-tutor-lms-assets"
} 