class Stores < ActiveRecord::Base
  validates :number, presence: true
  validates :location, presence: true

  belongs_to :district
end
