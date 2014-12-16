class Type < ActiveRecord::Base
  validates :admin, presence: true

  belongs_to :users
end
