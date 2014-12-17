require 'test_helper'

class RegionTest < ActiveSupport::TestCase
  test 'should not save region without data' do
    region = Region.new
    assert_not region.save
  end

  test 'should save region given a name' do
    region = Region.new name: 'test_region'
    assert region.save
  end
end
