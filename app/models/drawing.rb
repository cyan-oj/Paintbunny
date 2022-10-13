# == Schema Information
#
# Table name: drawings
#
#  id         :bigint           not null, primary key
#  artist_id  :bigint           not null
#  title      :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Drawing < ApplicationRecord
  validates :artist_id, :title, presence: true
  validates :title, uniqueness: { scope: [:artist_id], message: "you already have a drawing with this title" }

  # add description and alt text!
  
  belongs_to :artist,
    class_name: :User

  has_one_attached :image
end