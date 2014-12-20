class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :account
      t.string :email
      t.string :password
      t.integer

      t.references :type

      t.timestamps
    end
  end
end
