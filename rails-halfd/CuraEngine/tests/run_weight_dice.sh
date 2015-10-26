rm build/main.o 
# rm build/csvread.o 
make
./build/CuraEngine -s infillPattern=2 -v -o tests/gcodes/dice.gcode tests/stls/dice.stl