data "ibm_resource_group" "rg" {
  name = var.resource_group
}

resource "ibm_database" "mysqldb" {
  resource_group_id = data.ibm_resource_group.rg.id
  name              = "mysql-hello-world"
  service           = "databases-for-mysql"
  plan              = "standard"
  version           = "8.0"
  location          = var.region
  adminpassword     = var.admin_password


  timeouts {
    create = "120m"
    update = "120m"
    delete = "15m"
  }
}

output "url" {
  value = ibm_database.mysqldb.connectionstrings[0].composed
}

output "password" {
  value = var.admin_password
}

output "cert" {
  value = ibm_database.mysqldb.connectionstrings[0].certbase64
}

output "host" {
  value = ibm_database.mysqldb.connectionstrings[0].hosts[0].hostname
}

output "port" {
  value = ibm_database.mysqldb.connectionstrings[0].hosts[0].port
}

output "user" {
  value = ibm_database.mysqldb.connectionstrings[0].name
}