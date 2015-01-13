class Category < ActiveRecord::Base
  scope :root_nodes, where(:root => 1)

  validates :name, :presence => true
  validate :parent_id_must_be_valid

  has_many :children, class_name: "Category", foreign_key: "parent_id"
  belongs_to :parent, class_name: "Category"

  after_save :reload_routes

  def reload_routes
    DynamicRouter.reload
  end

  private

  def parent_id_must_be_valid
    unless parent_id.nil?
      false unless Category.find_by id: parent_id
    end
  end
end