require 'test_helper'

class TypeTest < ActiveSupport::TestCase
  test 'should not save types without data' do
    type = Type.new
    assert_not type.save, 'Saved without data'
  end

  test 'should save with just name' do
    type = Type.new name: 'test'
    assert type.save, 'Failed to save with just name'
  end

  test 'should not allow duplicately named types' do
    name = 'duplicate_test'
    type = Type.new name: name, admin: true, not_deletable: false
    assert type.save, 'Failed to save initial types'
    type = Type.new name: name, admin: false, not_deletable: false
    assert_not type.save, 'Duplicate was successfully saved'
  end

  test 'should save with a name and admin' do
    [true, false].each do |is_admin|
      type = Type.new name: "test_#{is_admin.to_s}", admin: is_admin
      assert type.save, "Failed to save #{"test_#{is_admin.to_s}"} that #{is_admin ? 'is':'is not'} an admin"
    end
  end
end
