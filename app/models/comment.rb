# == Schema Information
#
# Table name: comments
#
#  id         :bigint           not null, primary key
#  author_id  :bigint           not null
#  drawing_id :bigint           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Comment < ApplicationRecord
  validates :artist_id, :drawing_id, presence: true

  belongs_to :author,
    class_name: User

  belongs_to :drawing

  has_one_attached :image
end
