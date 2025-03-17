provider "aws" {
  region = var.aws_region
}

# Use modules to organize infrastructure
module "database" {
  source = "./modules/database"
  
  environment          = var.environment
  db_instance_class    = var.db_instance_class
  db_name              = var.db_name
  db_username          = var.db_username
  db_password          = var.db_password
  vpc_id               = module.api.vpc_id
  private_subnet_ids   = module.api.private_subnet_ids
}

module "storage" {
  source = "./modules/storage"
  
  environment          = var.environment
  video_bucket_name    = var.video_bucket_name
  assets_bucket_name   = var.assets_bucket_name
}

module "api" {
  source = "./modules/api"
  
  environment          = var.environment
  app_name             = var.app_name
  domain_name          = var.domain_name
  vpc_cidr             = var.vpc_cidr
  availability_zones   = var.availability_zones
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  container_port       = var.container_port
  container_cpu        = var.container_cpu
  container_memory     = var.container_memory
  instance_count       = var.instance_count
  health_check_path    = var.health_check_path
  ecr_repository_name  = var.ecr_repository_name
}

module "ai_services" {
  source = "./modules/ai-services"
  
  environment          = var.environment
  app_name             = var.app_name
  vpc_id               = module.api.vpc_id
  private_subnet_ids   = module.api.private_subnet_ids
  container_port       = var.ai_service_container_port
  container_cpu        = var.ai_service_container_cpu
  container_memory     = var.ai_service_container_memory
  ecr_repository_name  = var.ai_service_ecr_repository_name
  openai_api_key_arn   = var.openai_api_key_arn
}

# Outputs for important resources
output "api_endpoint" {
  value = module.api.api_endpoint
}

output "video_bucket_name" {
  value = module.storage.video_bucket_name
}

output "assets_bucket_name" {
  value = module.storage.assets_bucket_name
}

output "cloudfront_distribution_id" {
  value = module.storage.cloudfront_distribution_id
} 