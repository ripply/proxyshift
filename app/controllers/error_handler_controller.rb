class ErrorHandlerController < ApplicationController

  def create
    model_klass = model_class
    fail = false
    begin
      required_params = require_params
      if required_params.empty?
        logger.info "#{self.class}#create passed empty post information"
      end
      newly_created_object = model_klass.new required_params
      if newly_created_object.save
        redirect_to newly_created_object
      else
        fail = true
      end
    rescue ActionController::ParameterMissing => e
      # Parameter is missing...
      fail = true
    end

    if fail
      if newly_created_object.nil?
        # Parameter was missing
        # no need to print out errors
      else
        @errors = newly_created_object.errors
        errors = "Failed to create a #{model_klass.to_s}:\n"
        @errors.messages.each do |k, v|
          errors << "  #{k}: #{v}\n"
        end
        logger.debug errors
      end
      @error_class = model_klass
      session[:return_to] = request.referer
      render template: error_template
    end
  end

  protected

  def error_template
    '_error_template.html.erb'
  end

  def model_class
    raise NotImplementedError.new "Implement #{self.class.to_s}#model_class it should return the class of the model being created"
  end

  def require_params
    raise NotImplementedError.new "Implement #{self.class.to_s}#require_params"
  end

end