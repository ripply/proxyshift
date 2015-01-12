class DynamicRouter

  #
  # This method needs to be run within the Rails.Application.routes.draw context
  #

  def self.recurse(base_uri, parent, category)
    child_base_uri = "#{base_uri}/#{category.name}"
    puts "Routing #{child_base_uri}"
    get child_base_uri, :to => "categories#show", defaults: { id: category.id }
    category.children.each do |child|
      recurse child_base_uri, category, child
    end
  end

  def self.load
    Rails.Application.routes.draw do
      Categories.where(:parent_id => nil).each do |root|
        recurse '/', nil, root
      end
    end
  end

  def self.reload
    Rails.Application.routes_reloader.reload!
  end
end