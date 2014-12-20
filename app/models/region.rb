class Region < ActiveRecord::Base
  validates :name, presence: true

  belongs_to :companies

  has_many :districts
end
