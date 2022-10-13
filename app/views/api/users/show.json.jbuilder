json.user do
  json.extract! @user, :id, :email, :username, :created_at, :updated_at
  json.drawings @user.drawings do |drawing|
    json.merge! drawing.id
  end
end


json.drawings do
  @user.drawings.each do |drawing|
    json.partial! "api/drawings/drawing", drawing: drawing
  end
end