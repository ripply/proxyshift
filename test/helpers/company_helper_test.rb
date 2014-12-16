require 'test_helper'

class CompanyHelperTest < ActionView::TestCase
  test 'should not save company without data' do
    company = Company.new
    assert_not company.save, 'Saved without data'
  end

  test 'should save given a company name' do
    company = Company.new name: 'test_company'
    assert company.save, 'Failed to save company given a name'
  end
end
