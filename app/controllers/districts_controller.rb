class DistrictsController < ApplicationController
  def new

  end

  def create
    render plain: params[:district][:location]
  end
end
