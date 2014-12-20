class RegionsController < ErrorHandlerController
  protected

  def model_class
    Region
  end

  def require_params
    params.require(:region).permit(:name)
  end
end

