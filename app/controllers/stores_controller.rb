class StoresController < ErrorHandlerController
  def new

  end

  protected

  def model_class
    Store
  end

  def require_params
    params.require(:store).permit(:store_number, :location)
  end
end
