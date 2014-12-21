class CreateRegions < ActiveRecord::Migration
  def change
    create_table :regions do |t|
      t.string :name

      t.references :company

      t.timestamps
    end
  end
end
