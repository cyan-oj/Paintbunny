class Api::UsersController < ApplicationController
  wrap_parameters include: User.attribute_names + ['password', 'palette', 'brushes']
  before_action :require_logged_in, only: [:update]

  def show
    @user = User.find(params[:id])
    if @user
      render :show
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def create
    @user = User.new(user_params)

    if @user.save
      login!(@user)
      render :show
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    @user = User.find(params[:id])
    if @user.update(user_params)
      render :show
    else
      render json: { message: "tool update failed" }, status: 422
    end
  end

  private
  def user_params
    params.require(:user).permit(:email, :username, :password, :image, palette: [], brushes: [])
  end
end
