class TypesController < ErrorHandlerController
  def new

  end

  protected

  def model_class
    Type
  end

  def require_params
    params.require(:types).permit(:name, :presence)
  end
end
