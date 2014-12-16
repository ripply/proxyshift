class Company < ActiveRecord::Base
  validates :name, presence: true, uniqueness: true
  validates :website, format: {:with => /\A\z|\A(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?\z/}

  has_many :regions
end
