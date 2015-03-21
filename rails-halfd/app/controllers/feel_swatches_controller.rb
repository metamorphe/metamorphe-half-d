class FeelSwatchesController < ApplicationController
  before_action :set_feel_swatch, only: [:show, :edit, :update, :destroy]

  # GET /feel_swatches
  # GET /feel_swatches.json
  def index
    @feel_swatches = FeelSwatch.all
  end

  # GET /feel_swatches/1
  # GET /feel_swatches/1.json
  def show
  end

  # GET /feel_swatches/new
  def new
    @feel_swatch = FeelSwatch.new
  end

  # GET /feel_swatches/1/edit
  def edit
  end

  # POST /feel_swatches
  # POST /feel_swatches.json
  def create
    @feel_swatch = FeelSwatch.new(feel_swatch_params)

    respond_to do |format|
      if @feel_swatch.save
        format.html { redirect_to @feel_swatch, notice: 'Feel swatch was successfully created.' }
        format.json { render :show, status: :created, location: @feel_swatch }
      else
        format.html { render :new }
        format.json { render json: @feel_swatch.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /feel_swatches/1
  # PATCH/PUT /feel_swatches/1.json
  def update
    respond_to do |format|
      if @feel_swatch.update(feel_swatch_params)
        format.html { redirect_to @feel_swatch, notice: 'Feel swatch was successfully updated.' }
        format.json { render :show, status: :ok, location: @feel_swatch }
      else
        format.html { render :edit }
        format.json { render json: @feel_swatch.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /feel_swatches/1
  # DELETE /feel_swatches/1.json
  def destroy
    @feel_swatch.destroy
    respond_to do |format|
      format.html { redirect_to feel_swatches_url, notice: 'Feel swatch was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_feel_swatch
      @feel_swatch = FeelSwatch.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def feel_swatch_params
      params.require(:feel_swatch).permit(:name, :skin, :structure, :author, :description)
    end
end
