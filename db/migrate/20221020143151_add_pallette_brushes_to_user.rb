class AddPalletteBrushesToUser < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :palette, :string, array: true, :default => ["hsl(0, 0%, 100%)", "hsl(0, 0%, 0%)"]
    add_column :users, :brushes, :int, array: true, :default => [2, 5, 30, 70, 200]
  end
end