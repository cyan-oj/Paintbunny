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
  
end
