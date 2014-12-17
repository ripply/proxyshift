require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test 'should not save without data' do
    user = User.new
    assert_not user.save, 'Saved without data'
  end

  test 'should not save with just account' do
    user = User.new account: 'test_account'
    assert_not user.save, 'Saved with just account'
  end

  test 'should not save with just email' do
    user = User.new email: 'example@example.org'
    assert_not user.save, 'Saved with just email'
  end

  test 'should not save with just password' do
    user = User.new password: 'secret'
    assert_not user.save, 'Saved with just password'
  end

  test 'should save if account, email, password specified and valid' do
    user = User.new account: 'test_account', email: 'example@example.org', password: 'secret'
    assert user.save, 'Failed to save with valid data'
  end

  test 'should fail if invalid email given' do
    [
        'example',
        'example@asdf',
        '12341234',
        '12341234@microsoft',
        '!@#$!@#$!@#'
    ].each do |invalid_email|
      user = User.new account: 'test_account', email: invalid_email, password: 'secret'
      assert_not user.save, "Saved with invalid email address: #{invalid_email}"
    end
  end
end
