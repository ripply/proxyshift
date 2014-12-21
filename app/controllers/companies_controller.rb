class CompaniesController < ErrorHandlerController

  def list

  end

  def index
    if Company.count == 0
      render 'first_run'
    else
      @companies = Company.all
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

  def model_class
    Company
  end

  def require_params
    params.require(:company).permit(:name, :website)
  end
end
