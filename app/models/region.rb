class Region < ActiveRecord::Base
  validates :name, presence: true

  belongs_to :company

  has_many :districts
end
