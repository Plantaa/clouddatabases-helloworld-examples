data "ibm_resource_group" "rg" {
  name = var.resource_group
}

resource "ibm_database" "rabbitmq" {
  resource_group_id = data.ibm_resource_group.rg.id
  name              = "rabbit-hello-world"
  service           = "messages-for-rabbitmq"
  plan              = "standard"
  location          = var.region
  adminpassword     = var.admin_password


  timeouts {
    create = "120m"
    update = "120m"
    delete = "15m"
  }
}

output "url" {
  value = ibm_database.rabbitmq.connectionstrings[0].composed
}

output "password" {
  value = var.admin_password
}


output "cert" {
  value = ibm_database.rabbitmq.connectionstrings[0].certbase64
}
