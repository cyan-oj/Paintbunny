class Api::CommentsController < ApplicationController
  before_action :snake_case_params
  before_action :require_logged_in, only: [:create, :destroy]

  alias_attribute :user_id, :author_id

  def index
    drawing_id = params[:drawing_id]
    @comments = Comment.where(drawing_id: drawing_id) # add order by creation date to keep order
  end

  def create
    comment = Comment.new(comment_params)
    if comment.save
      render json: { message: "you have made yourself heard" }
    else
      render json: comment.errors.full_messages, status: 422
    end

  end

  def update

  end

  def destroy

  end

  private
  def comment_params
    params.require(:comment).permit(:author_id, :drawing_id, :image)
  end
end
