class User < ActiveRecord::Base
  def self.minimum_account_length
    3
  end

  def self.maximum_account_length
    25
  end

  def self.minimum_email_length
    3
  end

  validates :username,
            presence: true,
            length: {
                minimum: User.minimum_account_length,
                maximum: User.maximum_account_length
            }

  validates :email,
            presence: true,
            length: {
                minimum: User.minimum_email_length
            }
  # http://apidock.com/rails/ActiveModel/Validations/ClassMethods/validates
  validates :email,
            format: {
                with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i,
                on: :create
            }
  # TODO: http://api.rubyonrails.org/classes/ActiveModel/SecurePassword/ClassMethods.html#method-i-has_secure_password
  validates :password,
            presence: true

  has_one :type
  has_many :shifts
end
