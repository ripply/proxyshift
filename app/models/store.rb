class Store < ActiveRecord::Base
  validates :store_number, presence: true, uniqueness: true
  validates :location, presence: true

  belongs_to :district
end
