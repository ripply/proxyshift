class UsersController < ErrorHandlerController
  protected

  def model_class
    User
  end

  def require_params
    params.require(:user).permit(:account, :email, :password)
  end
end
