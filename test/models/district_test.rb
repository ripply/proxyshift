require 'test_helper'

class DistrictTest < ActiveSupport::TestCase
  test 'should not save district without data' do
    district = District.new
    assert_not district.save
  end

  test 'should save district given a name' do
    district = District.new name: 'test_district'
    assert district.save
  end

  test 'should be able to associate with a company' do
    company = Company.new(name: 'district_test_company', website: 'http://www.google.com')
    company.save
    region = company.regions.create(name: 'region_test')
    # TODO: assert new region... stuff
  end
end
