class DistrictsController < ErrorHandlerController
  def new

  end

  protected

  def model_class
    District
  end

  def require_params
    params.require(:district).permit(:name)
  end
end
