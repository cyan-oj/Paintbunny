class CreateDrawings < ActiveRecord::Migration[7.0]
  def change
    create_table :drawings do |t|
      t.references :artist, null: false, foreign_key: {to_table: :users}, index: false
      t.string :title, null: false
      t.timestamps
    end
    add_index :drawings, [:artist_id, :title], unique: true
  end
end
