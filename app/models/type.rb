class Type < ActiveRecord::Base
  validates :name, presence: true
  validates :admin, presence: true

  belongs_to :users
end
