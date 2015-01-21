require 'test_helper'

class UsersControllerTest < ActionController::TestCase
  setup do
    @user = users(:one)
  end

  test 'should get index' do
    get :index
    assert_response :success
    assert_not_nil assigns(:users)
  end

  test 'should get new' do
    get :new
    assert_response :success
  end

  test 'should create user' do
    assert_difference('User.count') do
      post :create, user: {
        username: 'test user',
        email: 'example@example.org',
        password: 'secret',
        password_confirmation: 'secret'
      }
    end

    assert_redirected_to user_path(assigns(:user))
  end

  test 'should show user' do
    get :show, id: @user
    assert_response :success
  end

  test 'should get edit' do
    get :edit, id: @user
    assert_response :success
  end

  test 'should update user' do
    patch :update, id: @user, user: {  }
    assert_redirected_to user_path(assigns(:user))
  end

  test 'should destroy user' do
    assert_difference('User.count', -1) do
      delete :destroy, id: @user
    end

    assert_redirected_to users_path
  end

  test 'API - /users.json sends empty response with no users' do
    assert_routing '/users.json', { :controller => 'users', :action => 'index', :format => 'json' }

    User.delete_all

    get :index, { 'format' => 'json' }

    assert response.status == 200, "Incorrect response: #{response.status}"

    body = JSON.parse(response.body)

    assert body.length == 0, "Length of response should be zero it is #{body.length}"
  end

  test 'API - /users.json sends all users' do
    assert_routing '/users.json', { :controller => 'users', :action => 'index', :format => 'json' }

    assert User.count != 0, 'Users need to exist as a precondition for this test'

    get :index, { 'format' => 'json' }

    assert response.status == 200

    body = JSON.parse(response.body)

    assert body.length == Shift.count, "Length of response(#{body.length}) does not match shift count(#{User.count})"

    puts 'wat'
    body.each do |key, value|
      puts key
      puts value
    end

    assert false, "#{body.to_s}"

  end

  test 'API - /users.json only super admin can see every user' do
    assert false, 'NYI'
  end

  test 'API - /users.json shows users that you admin' do
    assert false, 'NYI'
  end
end
