class Shift < ActiveRecord::Base
  validates :start, presence: true
  validates :end, presence: true
  #validates :user, allow_nil: true

  belongs_to :user
  # where the shift will take place
  belongs_to :category
end
