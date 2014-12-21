require 'test_helper'

class CompanyTest < ActiveSupport::TestCase
  test 'should not save company without data' do
    company = Company.new
    assert_not company.save, 'Saved without data'
  end

  test 'should save given a company name and blank website' do
    company = Company.new name: 'test_company'
    assert company.save, 'Failed to save company given a name'
  end

  test 'name should be unique' do
    name = 'unique_name_test'
    company = Company.new name: name
    assert company.save
    company = Company.new name: name
    assert_not company.save
  end

  test 'should save given a company name and valid website' do
    %w(
      www.google.com
      http://www.google.com
      http://www.google.com/
      http://www.google.com/test
      http://www.google.com/test.txt
      https://www.google.com
      https://www.google.com/
      https://www.google.com/test
      https://www.google.com/test.txt
    ).each do |valid_website|
      company = Company.new name: "test_company_#{valid_website}", website: valid_website
      assert company.save, "Failed to save company with valid website: #{valid_website}"
    end
  end

  test 'should not save company with invalid website' do
    %w(
      asdf
      1234
      asdf1234
      !@#!@#$%!!Kjkljasdlkfj!@#$JKLAJLSDJfljo2i318123l41j

      http:www.google.com
      http:www.google.com/
      http:/www.google.com
      http:/www.google.com/
      https:www.google.com
      https:www.google.com/
      https:/www.google.com
      https:/www.google.com/
      http://
      http://www.google.
      http://ww .google
      http://www.goo gle.com
    ).each do |invalid_website|
      company = Company.new name: 'test_company', website: invalid_website
      assert_not company.save, "Successfully saved company with invalid website: #{invalid_website}"
    end
  end
end
