Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

  namespace :api, defaults: { format: :json } do
    resources :users, only: [:create, :show, :update] do
      resources :drawings, only: [:index, :show, :create, :update, :destroy]
      resources :icons, only: [:index, :show, :create, :update, :destroy]
    end
    resources :drawings, only: [:index] do
      resources :comments, only: [:index, :create, :update, :destroy]
    end
    resource :session, only: [:show, :create, :destroy]
  end

  get '*path', to: "static_pages#frontend_index"
end
