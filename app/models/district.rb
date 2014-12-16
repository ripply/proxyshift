class District < ActiveRecord::Base
  validates :name, presence: true

  belongs_to :region

  has_many :stores
end
