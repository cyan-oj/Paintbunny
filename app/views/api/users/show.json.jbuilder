# json.set! @user.id do
#   json.extract! @user, :id, :email, :username, :created_at, :updated_at
# end
json.user do
  json.extract! @user, :id, :email, :username, :created_at, :updated_at
end