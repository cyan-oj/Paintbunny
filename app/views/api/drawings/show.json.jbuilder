json.drawing do
  json.extract! @drawing, :id, :artist_id, :title, :created_at, :updated_at
  json.imageUrl @drawing.image.url
end