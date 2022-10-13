class Api::DrawingsController < ApplicationController
  def index
    user_id = params[:user_id]    
    if user_id
      @drawings = Drawing.where(artist_id: user_id).limit(16)
    else
      @drawings = Drawing.all.limit(16)
    end
    render :index
  end

  def show
    @drawing = Drawing.find(params[:id])
    if @drawing
      render :show 
    else
      render json: { errors: ["this drawing does not exist"] }, status: 404
    end
  end

  def new

  end

  def create

  end

  def destroy

  end

  private
  def drawing_params
    params.require(:user).permit(:title, :author_id)
  end
end
