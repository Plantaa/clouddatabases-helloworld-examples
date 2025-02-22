terraform {
  required_providers {
    ibm = {
      version = "1.41.0"
      source  = "IBM-Cloud/ibm"
    }
  }
}

provider "ibm" {
  ibmcloud_api_key = var.ibmcloud_api_key
  region           = var.region
}

data "ibm_resource_group" "rg" {
  name = var.resource_group
}
