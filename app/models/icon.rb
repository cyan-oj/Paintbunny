class Icon < ApplicationRecord
  validates :user_id, presence: true

  belongs_to :user,
    class_name: :User

  has_one_attached :image
end
