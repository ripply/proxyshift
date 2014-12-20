require 'test_helper'
require_relative '../../app/controllers/companies_controller'

class CompaniesControllerTest < ActionController::TestCase
  tests CompaniesController

  def error_template
    '_error_template.html.erb'
  end

  test 'should not create company' do
    assert_no_difference 'Company.count' do
      #post :create, company: {}
    end
  end

  test 'should create company' do
    assert_difference 'Company.count' do
      post :create, company: {name: 'test_company', website: 'http://www.google.com/'}
      # TODO: assert post redirected to new company
      #assert_template error_template
    end
  end
end
