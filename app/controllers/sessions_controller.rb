class SessionsController < ApplicationController

  include SessionsHelper

  def new
    if User.count == 0
      redirect_to signup_path
    elsif signed_in?
      redirect_to users_path
    end
    @title = 'title.signin'
  end

  def create
    user = User.find_by_username(params[:session][:username])
    if user && user.authenticate(params[:session][:password])
      sign_in user
      redirect_back_or users_path
    else
      flash.now.alert = 'Invalid username or password'
      render 'new'
    end
  end

  def destroy
    if signed_in?
      sign_out
    else
      redirect_back_or root_path
    end
  end

end
