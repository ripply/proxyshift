class CreateCategories < ActiveRecord::Migration
  def change
    create_table :categories do |t|
      t.string :name
      t.integer :parent_id
      t.integer :root, :default => 0

      t.references :categories

      t.timestamps
    end
  end
end
