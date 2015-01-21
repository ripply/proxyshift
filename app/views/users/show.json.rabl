object @user

attributes :id, :username, :email

node :url do |u|
  user_url u
end

node :json do |u|
  user_url u, format: :json
end
