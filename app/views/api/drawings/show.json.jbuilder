json.drawing do  
  json.partial! "api/drawings/drawing", drawing: @drawing
  json.extract! @drawing, :comment_ids
end

@drawing.comments.includes(:author).each do |comment|
  json.comments do
    json.set! comment.id do
      json.partial! 'api/comments/comment', comment: comment
    end
  end
end