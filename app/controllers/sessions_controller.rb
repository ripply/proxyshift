class SessionsController < ApplicationController

  include SessionsHelper

  def new
    if User.count == 0
      redirect_to signup_path
    elsif signed_in?
      redirect_to '/loggedinyeyeye'
    end
    @title = 'Sign in'
  end

  def create
    user = User.find_by_username(params[:session][:username])
    if user && user.authenticate(params[:session][:password])
      sign_in user
      redirect_back_or '/loggedinyeyeye'
    else
      flash.now.alert = 'Invalid username or password'
      render 'new'
    end
    #user = User.find_by(username: params[:session][:username])
    #if user && user.authenticate(params[:session][:password])
    #  sign_in user
    #  redirect_back_or user
    #else
    #  puts 'NOPEEEEEEEEEEEE'
    #end
  end

end
