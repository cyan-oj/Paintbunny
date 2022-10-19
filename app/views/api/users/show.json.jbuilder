json.user do
  json.partial! "api/users/user", user: @user
  json.drawings @user.drawings do |drawing|
    json.merge! drawing.id
  end
end

@user.drawings.each do |drawing|
  json.drawings do
    json.set! drawing.id do
      json.partial! "api/drawings/drawing", drawing: drawing
    end
  end
end