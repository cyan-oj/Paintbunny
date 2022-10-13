json.drawings do
  @drawings.each do |drawing|
    json.set! drawing.id do
      json.partial! "api/drawings/drawing", drawing: drawing
    end
  end
end