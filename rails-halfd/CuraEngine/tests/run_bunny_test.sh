# rm build/main.o 
# rm build/csvread.o 
# make
./build/CuraEngine -s infillPattern=2 -v -o tests/gcodes/bunny_big.gcode tests/stls/bunny_big.stl