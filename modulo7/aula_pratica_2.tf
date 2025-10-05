provider "google" {
  project     = ""
  region      = ""
}

resource "google_storage_bucket" "test-bucket-for-state" {
  name        = ""
  location    = "US"
  uniform_bucket_level_access = true
}

terraform {
  backend "gcs" {
    bucket  = ""
    prefix  = "terraform/state"
  }
}

resource "docker_image" "nginx" {
  name         = "nginx:latest"
}

resource "docker_container" "web" {
  name  = "hashicorp-learn"
  image = docker_image.nginx.image_id

  ports {
    external = 8081
    internal = 80
    ip       = "0.0.0.0"
    protocol = "tcp"
  }
}