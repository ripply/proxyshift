require_relative 'category'

class DynamicRouter

  #
  # This method needs to be run within the Rails.Application.routes.draw context
  #

  def self.recurse(results, base_uri, parent, category)
    child_base_uri = "#{base_uri}/#{category.name}"
    puts "Routing #{child_base_uri}"
    results << "get '#{child_base_uri}', :to => 'categories#show', defaults: { id: #{category.id} }"
    category.children.each do |child|
      DynamicRouter.recurse results, child_base_uri, category, child
    end
  end

  def self.load
    Rails.application.routes.draw do
      puts "!???????????????????"
      routes_strings = []
      Category.where(:parent_id => nil).each do |root|
        DynamicRouter.recurse routes_strings, '/', nil, root
      end
      instance_eval(routes_strings.join("\n"), 'routes', 0)
    end
  end

  def self.reload
    Rails.application.routes_reloader.reload!
  end
end