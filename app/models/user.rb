class User < ActiveRecord::Base
  include UsersHelper

  validates :username,
            presence: true,
            length: {
                minimum: UsersHelper.minimum_account_length,
                maximum: UsersHelper.maximum_account_length
            }

  validates_uniqueness_of :username

  validates :email,
            presence: true,
            length: {
                minimum: UsersHelper.minimum_email_length
            }

  validates_uniqueness_of :email

  # http://apidock.com/rails/ActiveModel/Validations/ClassMethods/validates
  validates :email,
            format: {
                with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i,
                on: :create
            }

  has_secure_password

  has_one :type
  has_many :shifts

  has_settings :language
end
