class CreateShifts < ActiveRecord::Migration
  def change
    create_table :shifts do |t|
      t.date :start
      t.date :end

      t.boolean :splittable
      t.references :user

      t.timestamps
    end
  end
end
