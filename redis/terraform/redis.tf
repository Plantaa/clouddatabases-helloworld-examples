data "ibm_resource_group" "rg" {
  name = var.resource_group
}

resource "ibm_database" "redisdb" {
  resource_group_id = data.ibm_resource_group.rg.id
  name              = "redis-hello-world"
  service           = "databases-for-redis"
  plan              = "standard"
  location          = var.region
  tags              = []
  adminpassword     = var.admin_password
}

resource "ibm_resource_key" "redis_credentials" {
  name                 = "my-redis-key"
  role                 = "Administrator"
  resource_instance_id = ibm_database.redisdb.id
}

output "redis_credentials" {
  value     = ibm_resource_key.redis_credentials.credentials
  sensitive = true
}
