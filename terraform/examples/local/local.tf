resource "local_file" "my_file" {
  content  = var.content
  filename = "local_file.txt"
}

data "local_file" "my_file" {
  filename = local_file.my_file.filename
}
