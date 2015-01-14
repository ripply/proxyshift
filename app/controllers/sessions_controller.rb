class SessionsController < ApplicationController

  include SessionsHelper

  def new
    if User.count == 0
      redirect_to signup_path
    end
    @title = 'Sign in'
  end

  def create
    user = User.find_by_username(params[:session][:username])
    if user && user.authenticate(params[:session][:password])
      puts 'YEPPPP'
      sign_in user
      redirect_back_or user
    else
      if user.authenticate(params[:password])
        puts 'AUTHENTICATED??'
      else
        puts "FAILE AUTHENTICXATE"
      end
      puts "NOPEEEE"
      flash.now.alert = "Invalid email or password"
      render "new"
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
