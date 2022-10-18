class Api::DrawingsController < ApplicationController
  # wrap_parameters include: Drawing.attribute_names + [:image] + [:user_id]
  before_action :snake_case_params
  before_action :require_logged_in, only: [:create, :destroy]

  alias_attribute :user_id, :artist_id

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
  
  def create
    drawing = Drawing.new(drawing_params)
    if drawing.save
      render json: { message: "poatsted"}
    else
      render json: drawing.errors.full_messages, status: 422
    end
  end

  def update
    @drawing = drawing.find(params[:id])

    if @drawing.update(drawing_params)
      render :show
    else 
      render json: { errors: ["could not update drawing"] }
    end
  end

  def destroy
    @drawing = current_user.drawings.find(params[:id])
    if @drawing
      @drawing.destroy
      redirect_to api_users_url(current_user)
    else 
      render json: { message: "you can't do that" }, status: :unauthorized
    end
  end

  private
  def drawing_params
    params.require(:drawing).permit(:title, :artist_id, :image)
  end
end
