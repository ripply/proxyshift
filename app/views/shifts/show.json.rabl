object @shift

attributes :id#, :start, :end

node :start do |u|
  u.start.to_s
end

node :end do |u|
  u.end.to_s
end

node :url do |u|
  shift_url u
end

node :json do |u|
  shift_url u, format: :json
end