class CompaniesController < ApplicationController

  def list

  end

  def index
    if Company.count == 0
      render 'first_run'
    else
      @companies = Company.all
    end
  end

  def create
    @company = Company.new(company_params)
    if @company.save
      redirect_to @company
    else
      @errors = @company.errors
      session[:return_to] = request.referer
      render template: 'companies/_errors.html.erb'
    end
  end

  def error

  end

  def new

  end

  def show
    @company = Company.find(params[:id])
  end

  private

  def company_params
    params.require(:company).permit(:name, :website)
  end
end
