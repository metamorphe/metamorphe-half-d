class SwatchesController < ApplicationController
  before_filter :authenticate_user!
  before_action :set_swatch, only: [:threed, :show, :edit, :update, :destroy]

  # GET /swatches
  # GET /swatches.json
  def index
    @swatches = Swatch.all
  end

  # GET /swatches/1
  # GET /swatches/1.json
  def show
  end

  def threed  
    render :layout => "full_screen" 
  end

  # GET /swatches/new
  def new
    @swatch = Swatch.new
  end

  # GET /swatches/1/edit
  def edit
  end

  # POST /swatches
  # POST /swatches.json
  def create
    @swatch = Swatch.new(swatch_params)
    @swatch.user = current_user
    respond_to do |format|
      if @swatch.save
        format.html { redirect_to @swatch, notice: 'Swatch was successfully created.' }
        format.json { render :show, status: :created, location: @swatch }
      else
        format.html { render :new }
        format.json { render json: @swatch.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /swatches/1
  # PATCH/PUT /swatches/1.json
  def update
    respond_to do |format|
      if @swatch.update(swatch_params)
        format.html { redirect_to @swatch, notice: 'Swatch was successfully updated.' }
        format.json { render :show, status: :ok, location: @swatch }
      else
        format.html { render :edit }
        format.json { render json: @swatch.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /swatches/1
  # DELETE /swatches/1.json
  def destroy
    @swatch.destroy
    respond_to do |format|
      format.html { redirect_to swatches_url, notice: 'Swatch was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_swatch
      @swatch = Swatch.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def swatch_params
      params.require(:swatch).permit(:name, :bump_map, :base_height, :displacement, :height, :width, :depth, :stl, :thumbnail, :layer_id)
    end
end
