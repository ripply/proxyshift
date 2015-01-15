class PagesController < ApplicationController

  include SessionsHelper

  def home
    @title = 'title.welcome'
    if signed_in?
      @title = 'title.signed_in'
      render 'dashboard'
    end
  end

  def dashboard
    @title = 'title.dashboard'
  end

end
