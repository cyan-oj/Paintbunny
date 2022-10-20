class Api::CommentsController < ApplicationController
  before_action :snake_case_params
  before_action :require_logged_in, only: [:create, :destroy]

  alias_attribute :user_id, :author_id

  def index
    drawing_id = params[:drawing_id]
    @comments = Comment.where(drawing_id: drawing_id) # add order by creation date to keep order
  end

  def create
    @comment = Comment.new(comment_params)
    if @comment.save
      render :show
    else
      render json: @comment.errors.full_messages, status: 422
    end

  end

  def update

  end

  def destroy
    @comment = current_user.comments.find(params[:id])
    if @comment.destroy
      render json: { message: "comment deleted" }
    else
      render json: { message: "you can't do that" }
    end
  end

  private
  def comment_params
    params.require(:comment).permit(:author_id, :drawing_id, :image)
  end
end
