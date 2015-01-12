class CreateCategories < ActiveRecord::Migration
  def change
    create_table :categories do |t|
      t.string :name
      t.integer :parent_id
      t.boolean :root, :default => false

      t.references :categories

      t.timestamps
    end
  end
end
