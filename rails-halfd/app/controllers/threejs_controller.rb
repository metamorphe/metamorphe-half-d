class ThreejsController < ApplicationController
  def height_displacement
	@files = Dir.glob("public/heightmap/images/*").collect!{|c| c.split('/')[-1]}.to_json.html_safe
  	render :layout => "full_screen"
  	# render :json => @files
  end
  def environment
  	render :layout => "full_screen"
  end
  def plane_box
  	render :layout => "full_screen"
  end

end
