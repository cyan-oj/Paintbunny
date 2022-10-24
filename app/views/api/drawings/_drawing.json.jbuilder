json.extract! drawing, :id, :artist_id, :title, :description, :created_at, :updated_at
json.artist drawing.artist.username
json.imageUrl drawing.image.url
