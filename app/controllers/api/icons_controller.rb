class Api::IconsController < ApplicationController
  before_action :snake_case_params
  before_action :require_logged_in, only: [:index, :create, :destroy, :update]

  def index
    user_id = params[:user_id]
    if user_id
      @icons = Icon.where(user_id: user_id)
      render :index
    else 
      render json: { "you can't view these icons" }
    end
  end

  def show
    user_id = params[:user_id]
    @icon = Icon.where(user_id: user_id).and(Icon.where(id: params[:id]))
    if @icon
      render :show
    else
      render json: { errors: ["no icon found"] }, status: 404
    end
  end

  def create
    @icon = Icon.new(drawing_params)
    if @icon.save
      render :show
    else
      render json: icon.errors.full_messages, status: 422
    end
  end

  def update
    @icon = Icon.find(params[:id])

    if @icon.update(icon_params)
      render :show
    else
      render json: { errors: ["could not update icon"] }
    end
  end

  def destroy
    @icon = current_user.icon

    if @icon.destroy
      render json: { "icon destroyed"}
    else
      render json: { message: "you can't do that" }, status: unauthorized
    end
  end

  private
  def drawing_params
    params.require(:icon).permit(:user_id)
  end
end
