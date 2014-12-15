class Type < ActiveRecord::Base
  validates :admin, presence: true, inclusion { in: [true, false] }
end
