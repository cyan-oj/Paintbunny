class Api::DrawingsController < ApplicationController
  # wrap_parameters include: Drawing.attribute_names + [:image] + [:user_id]
  before_action :snake_case_params
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

  def new

  end

  def create
    drawing = Drawing.new(drawing_params)
    if drawing.save
      render json: { message: "poatsted"}
    else
      render json: drawing.errors.full_messages, status: 422
    end
  end

  def destroy


  end

  private
  def drawing_params
    params.require(:drawing).permit(:title, :artist_id, :image)
  end
end
