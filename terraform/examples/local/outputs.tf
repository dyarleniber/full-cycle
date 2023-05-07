output "file_content" {
  value       = local_file.my_file.content
  description = "The content of the local file"
}

output "file_id" {
  value       = local_file.my_file.id
  description = "The ID of the local file"
}

output "file_filename" {
  value       = local_file.my_file.filename
  description = "The filename of the local file"
}

output "data_source_file_content" {
  value       = data.local_file.my_file.content
  description = "The content of the local file"
}

output "data_source_file_content_base64" {
  value       = data.local_file.my_file.content_base64
  description = "The content of the local file in base64"
}
