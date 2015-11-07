require 'em-websocket'
require 'json'
require 'serialport'
 
sp = SerialPort.new('/dev/tty.usbmodem1411', 9600, 8, 1, SerialPort::NONE)
print "Starting server at 3015"
def message_from(sp)
 	message = sp.gets
 	message.chop!
  	message = message.to_s.split(' ')
  	# print "MSG" + message[1] + "\n"
  	if message[0] == "cap"
	  	id = message[1].to_i
	  	val = message[2].to_i
	  	return {"event"=> { :id=> id, :value => val, :valid => true}}
    else
	  	return { "event" => {:valid => false} }
	end
end

EventMachine::WebSocket.start(:host => '0.0.0.0', :port => 3015) do |ws|
  ws.onopen    { ws.send "hello client" }
  ws.onclose   { puts "WebSocket closed" }
 
  ws.onmessage do	
	    ws.send message_from(sp).to_json
  end
end
 
