json.extract! comment, :id, :author_id, :drawing_id, :created_at, :updated_at
json.author comment.author.username
json.imageUrl comment.image.url