@drawings.each do |drawing|
  json.drawings do 
    json.set! drawing.id do
      json.partial! "api/drawings/drawing", drawing: drawing
    end
  end 
end
