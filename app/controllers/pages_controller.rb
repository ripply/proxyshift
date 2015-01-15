class PagesController < ApplicationController

  include SessionsHelper

  def home
    @title = 'title.welcome'
    if signed_in?
      @title = 'title.signed_in'
    end
  end

end
