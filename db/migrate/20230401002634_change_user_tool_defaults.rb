class ChangeUserToolDefaults < ActiveRecord::Migration[7.0]
  def change
    remove_column :users, :palette
    remove_column :users, :brushes

    add_column :users, :palette, :int, array: true, :default => [[ 255, 255, 255 ], [ 245, 200, 110 ], [ 230, 125, 85 ], [ 190, 50, 40 ], [ 100, 115, 75 ], [ 75, 70, 120 ], [ 60, 40, 55 ], [ 0, 0, 0 ]]
    add_column :users, :brushes, :int, array: true, :default => [{ ratio: 1, scale: 0.1, angle: 30, spacing: 0.004 },{ ratio: 1, scale: 5, angle: 0, spacing: 0.004 },{ ratio: 0.01, scale: 2, angle: 180, spacing: 0.002 }]
  end
end
