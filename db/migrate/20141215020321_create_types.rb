class CreateTypes < ActiveRecord::Migration
  def change
    create_table :types do |t|
      t.boolean :admin
      t.string :name

      t.timestamps
    end
  end
end
