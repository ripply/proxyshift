require 'test_helper'

class StoresHelperTest < ActionView::TestCase
  def random_store_number
    Random.rand(10000) + 2
  end

  test 'should not save store without data' do
    store = Store.new
    assert_not store.save, 'Successfully saved store without data'
  end

  test 'should not save a store given just a store number' do
    store = Store.new store_number: 1
    assert_not store.save, 'Successfully saved with just a store number'
  end

  test 'should not save a store given just a store location' do
    store = Store.new location: 'test_location'
    assert_not store.save, 'Successfully saved with just location'
  end

  test 'store_number should be unique' do
    rand_store_number = random_store_number
    store = Store.new store_number: rand_store_number, location: 'test_location'
    assert store.save, "Failed to save valid store #{store.inspect}"
    store = Store.new store_number: rand_store_number, location: 'test_location'
    assert_not store.save, 'Successfully inserted duplicate store_number'
  end

  test 'should save a store given valid inputs' do
    store = Store.new store_number: random_store_number, location: 'test_location'
    assert store.save, "Failed to save a store with valid inputs #{store.inspect}"
  end
end
