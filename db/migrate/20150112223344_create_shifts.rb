class CreateShifts < ActiveRecord::Migration
  def change
    create_table :shifts do |t|
      t.datetime :start
      t.datetime :end

      t.boolean :splittable
      t.references :user

      t.timestamps
    end
  end
end
