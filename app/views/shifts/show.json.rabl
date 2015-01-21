object @shift

attributes :id#, :start, :end

node :start do |u|
  u.start.rcf822
end

node :end do |u|
  u.aend.rcf822
end

node :url do |u|
  shift_url u
end

node :json do |u|
  shift_url u, format: :json
end