class InternalController < ApplicationController
	@@BUILD_PATH = "CuraEngine/build/";
	@@CONFIG_EXTENSION = "CuraEngine/build/";

	def tool
		 # @filepath = "/stls/xactohandle.STL"
	    # @filepath = "/stls/meshdice.stl"
	    # @filepath = "/stls/bunny.stl"
	    # @filepath = "/stls/rectprism-fillet-2.STL"
	    # render :json  => @configs


	    @filepath = "/stls/wheel2.stl"
	    @configs = Dir.glob("#{@@BUILD_PATH}*.cfg").map!{ |e| e.split('/')[-1].split('.')[-2]}
  		render :layout => "full_screen"
  	end

  	def cure
  		gcode = `./CuraEngine/build/CuraEngine -c 'CuraEngine/build/#{params[:config]}.cfg' -s infillPatern=2 -o public/gcodes/#{params[:name]}.gcode public/#{params[:stl]}`
  		# ./CuraEngine/build/CuraEngine -c 'build/high_PLE.cfg' -s infillPatern=2 -v -o tests/gcodes/bunny_big_test.gcode tests/stls/bunny_big.stl
  		gcode = "/" + gcode.split('/')[1..-1].join('/')
  		params[:gcode] = gcode
  		render :json => params
  	end
end
