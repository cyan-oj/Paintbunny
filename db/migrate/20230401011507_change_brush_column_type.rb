class ChangeBrushColumnType < ActiveRecord::Migration[7.0]
  def change
    remove_column :users,  :brushes

    add_column :users, :brushes, :jsonb, default: [{ ratio: 1, scale: 0.1, angle: 30, spacing: 0.004 },{ ratio: 1, scale: 5, angle: 0, spacing: 0.004 },{ ratio: 0.01, scale: 2, angle: 180, spacing: 0.002 }], null: false
  end
end