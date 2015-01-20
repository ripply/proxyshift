require 'active_support/core_ext'

module SessionsHelper

  def sign_in(user)
    #cookies.permanent.signed[:remember_token] = [user.id]
    session[:user_id] = user.id
    update_session_expiration_time
    self.current_user = user
  end

  def current_user=(user)
    @current_user = user
  end

  def current_user
    @current_user ||= user_from_session
  end

  def signed_in?
    !current_user.nil? && !signin_expired?
  end

  def signin_expired?
    session[:session_expires].nil? ||
        ((time_now > session[:session_expires]) && update_session_expiration_time)
  end

  def sign_out
    session.delete :user_id
    session.delete :session_expires
    self.current_user = nil
  end

  def current_user?(user)
    user == current_user
  end

  def authenticate
    deny_access unless signed_in?
  end

  def deny_access
    store_location
    redirect_to signin_path, :notice => 'Please sign in to access this page.'
  end

  def redirect_back_or(default)
    redirect_to(session[:return_to] || default)
    clear_return_to
  end

  private

  def time_now
    Time.now.utc
  end

  def update_session_expiration_time
    # TODO: ActiveSupport::TimeWithZone, because this does not handle DST boundaries correctly
    session[:session_expires] = time_now + 1.days
  end

  def user_from_session
    User.find_by_id user_id
  end

  def user_id
    session[:user_id]
  end

  def remember_location
    session[:return_to] = request.fullpath
  end

  def clear_return_to
    session[:return_to] = nil
  end
end