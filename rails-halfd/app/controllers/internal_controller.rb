class InternalController < ApplicationController
	@@BUILD_PATH = "CuraEngine/build/";
	@@CONFIG_EXTENSION = "CuraEngine/build/";

	def tool
		 # @filepath = "/stls/xactohandle.STL"
	    # @filepath = "/stls/meshdice.stl"
	    # @filepath = "/stls/bunny.stl"
	    # @filepath = "/stls/rectprism-fillet-2.STL"
	    # render :json  => @configs

	    @stl = Swatch.find(params[:id])
	    @filepath = @stl.stl.url #"/stls/wheel2.stl"
	    @configs = Dir.glob("#{@@BUILD_PATH}*.cfg").map!{ |e| e.split('/')[-1].split('.')[-2]}
  		# render :json => @filepath
  		render :layout => "full_screen"
  	end

  	def cure
  		# -s infillPatern=2
  		posx = 0
  		posy = 0
  		# -s posx=#{posx} -s posy=#{posy}
  		gcode = `./CuraEngine/build/CuraEngine -c 'CuraEngine/build/#{params[:config]}.cfg'   -o public/gcodes/#{params[:name]}.gcode public/#{params[:stl]}`
  		# ./CuraEngine/build/CuraEngine -c 'build/high_PLE.cfg' -s infillPatern=2 -v -o tests/gcodes/bunny_big_test.gcode tests/stls/bunny_big.stl
  		gcode = "/" + gcode.split('/')[1..-1].join('/')
  		params[:gcode] = gcode
  		render :json => params

  	end

  	def tmp_save
  		File.open("public/tmp/csv/test.csv", "w") { |file| file.write params[:csv] }
  		File.open("public/tmp/stl/test.stl", "w") { |file| file.write params[:stl] }
  		render :json => {csv: "/tmp/csv/test.csv", stl: "/tmp/stl/test.stl"}
  	end
end
