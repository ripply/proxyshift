require 'test_helper'

class DistrictsHelperTest < ActionView::TestCase
  test 'should not save district without data' do
    district = District.new
    assert_not district.save
  end

  test 'should save district given a name' do
    district = District.new name: 'test_district'
    assert district.save
  end
end
