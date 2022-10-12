class Api::DrawingsController < ApplicationController
  def index

  end

  def show
    @drawing = Drawing.find(params[:id])
    render :show
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
