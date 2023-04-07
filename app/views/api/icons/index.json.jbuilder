@icons.each do |icon|
  json.icons do
    json.set! icon.id do
      json.partial! "api/icons/icon", icon: icon
    end
  end
end