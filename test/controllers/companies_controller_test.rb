require 'test_helper'
require_relative '../../app/controllers/companies_controller'

class CompaniesControllerTest < ActionController::TestCase
  def setup
    @controller = CompaniesController.new
  end

  test 'should not create company' do
    assert_no_difference 'Company.count' do
      post :create, post: {company: 'test_company'}
    end

    assert_redirected_to post_path(assigns(:post))
  end
end
