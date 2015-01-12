class Category < ActiveRecord::Base
  validates :name, :presence => true

  has_many :children, class_name: "Category", foreign_key: "parent_id"
  belongs_to :parent, class_name: "Category"

  after_save :reload_routes

  def reload_routes
    DynamicRouter.reload
  end
end