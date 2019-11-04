all: calc

calc: main.o calculator.o
	g++ main.o calculator.o -o calc

main.o: main.cpp
	g++ -c main.cpp

calculator.o: calculator.cpp
	g++ -c calculator.cpp

clean:
	rm -rf *.o calc