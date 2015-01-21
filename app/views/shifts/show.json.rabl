object @shift

attributes :id, :start, :end

node :url do |u|
  shift_url u
end

node :json do |u|
  shift_url u, format: :json
end