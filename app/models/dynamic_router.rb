require_relative 'category'

class DynamicRouter

  #
  # This method appends strings to results parameter
  #
  # @param Array<String> results
  # @param String base_uri
  # @param ActiveRecord::Base parent
  # @param ActiveRecord::Base category
  #
  # @returns Array<String>
  #

  def self.recurse(results, base_uri, parent, category)
    child_base_uri = "#{base_uri}/#{category.name}"
    route = (DynamicRouter.named_route_for_uri child_base_uri).to_sym
    # if route turns out to be calculated to an existing route then we need to change it or rails will error due to duplicate named routes
    exists = false
    begin
      exists = false
      Rails.application.routes.named_routes.each do |existing_route|
        if existing_route == route
          exists = true
          break
        end
      end
      route = "#{route.to_s}_".to_sym if exists
    end while exists
    results << "get '#{child_base_uri}', :to => 'categories#show', as: '#{route}', defaults: { id: #{category.id}, route: '#{route}'}"
    # TODO: edit_route could be in use maybe
    results << "get '#{child_base_uri}/edit', :to => 'categories#edit', as: 'edit_#{route}', defaults: { id: #{category.id}, route: '#{route}'}"
    # TODO: new_route could be in use maybe
    results << "get '#{child_base_uri}/new', :to => 'categories#new', as: 'new_#{route}', defaults: { id: #{category.id}, route: '#{route}'}"
    category.children.each do |child|
      puts "Recursing into: #{child.to_s}"
      DynamicRouter.recurse results, child_base_uri, category, child unless child == category
    end

    results
  end

  def self.named_route_for_uri(uri)
    # strip leading and ending garbage underscores or forward slashes
    ((uri.sub /^[_\/]*/, '').sub! /[_\/]*$/, '').downcase.gsub '/', '_' unless uri.nil?
  end

  def self.load
    Rails.application.routes.draw do
      routes_strings = []
      Category.where(:root => 1).each do |root|
        DynamicRouter.recurse routes_strings, '/', nil, root
      end
      begin
        instance_eval(routes_strings.join("\n"), 'dynamic routes', 0)
      rescue Exception => e
        raise e, "#{e.message}\nRoutes:::: #{routes_strings.join "\n"}", e.backtrace
      end
    end
  end

  def self.reload
    Rails.application.routes_reloader.reload!
  end
end