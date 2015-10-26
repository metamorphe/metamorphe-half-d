rm build/main.o 
# rm build/csvread.o 
make
./build/CuraEngine -s infillPattern=1 -v -o tests/gcodes/gridlog.gcode tests/stls/rectprism-fillet-2.STL