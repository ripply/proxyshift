class User < ActiveRecord::Base
  validates :account, presence: true
  validates :email, presence: true
  validates :password, presence: true

  has_one :type
end
