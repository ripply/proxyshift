class PagesController < ApplicationController

  include SessionsHelper

  def home
    @title = 'Welcome'
    if signed_in?
      @title = 'SIGNED IN!!!'
    end
  end

end
