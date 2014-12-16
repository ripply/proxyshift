class User < ActiveRecord::Base
  validates :account, presence: true
  validates :email, presence: true
  # http://apidock.com/rails/ActiveModel/Validations/ClassMethods/validates
  validates :email, format: { with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i, on: :create }
  validates :password, presence: true

  has_one :type
end
