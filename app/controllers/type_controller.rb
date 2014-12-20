class TypeController < ErrorHandlerController
  def new

  end

  protected

  def model_class
    Type
  end

  def require_params
    params.require(:type).permit(:name, :presence)
  end
end
