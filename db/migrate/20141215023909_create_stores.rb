class CreateStores < ActiveRecord::Migration
  def change
    create_table :stores do |t|
      t.integer :store_number
      t.string :name
      t.string :location

      t.references :district

      t.timestamps
    end
  end
end
