class AddDescriptionToDrawings < ActiveRecord::Migration[7.0]
  def change
    add_column :drawings, :description, :string, :default => ''
  end
end
