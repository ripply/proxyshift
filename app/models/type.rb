class Type < ActiveRecord::Base
  validates :name, presence: true
  validates :admin, presence: true
  validates_uniqueness_of :name

  belongs_to :users
end
