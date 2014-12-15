class District < ActiveRecord::Base
  validates :name, presence: true
end
