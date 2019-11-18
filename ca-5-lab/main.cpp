#include <stdlib.h>
#include <stdio.h>
#include <getopt.h>
#include <string.h>
#include <iostream>

using namespace std;

void display_usage() {

	printf("\nArguments:\n"
	"-h, --help to show help \n"
	"-v, --version to set the version of an application \n"
	"-l, --list to set the array of digits\n"
	"-f, --file to set the file \n");
}

int main (int argc, char *argv[]){

	static const char* short_options = "v:l:f:h?";

	static const struct option long_options[] = {
		{"help",no_argument,NULL,'h'},
		{"version",optional_argument,NULL,'v'},
		{"list",optional_argument,NULL,'l'},
		{"file",required_argument,NULL,'f'},
		{NULL,0,NULL,0}
	};

	int res;
	int option_index = -1;
	float version = 1.0;
	int list[5];
	string file = "file.txt";

	list[0] = 1;
	list[1] = 2;
	list[2] = 3;
	list[3] = 4;
	list[4] = 5;

	int counter = 0;

	res = getopt_long(argc,argv,short_options,long_options,&option_index);

	while (res!=-1){
		
		switch(res){

			case 'v': {
				if (optarg!=NULL){
					version = stof(optarg);
					break;
				}
				else
					printf("Found version key with ankward value. \n");
					break;
			};
			
			case 'l': {
				if (optarg!=NULL){
          list[0] = optarg[0] - '0';
	        list[1] = optarg[2] - '0';
        	list[2] = optarg[4] - '0';
        	list[3] = optarg[6] - '0';
        	list[4] = optarg[8] - '0';
          break;
        }
        else
          printf("Found array key with clumsy values. \n");
          break;
			};
			
			case 'f': {
				file = optarg;
				break;
			};
			
			case 'h': {
        if (counter > 0)
          break;
        else
          counter += 1;
          display_usage();
          break;
        };
			
			case '?': {
				break;
			};
			
			default:{
				break;
			}
		};

		option_index = -1;
		res = getopt_long(argc,argv,short_options,long_options,&option_index);
	};

	if (version <= 0){
		printf("Version must be greater than 0 \n");
		return EXIT_FAILURE;
	}

	printf("version: %.1f \n", version);
  cout << "array: " <<"["<< list[0] << ", " << list[1] << ", " << list[2] << ", " << list[3] << ", " << list[4] << "]" << endl;
  printf("file: %s \n", file.c_str());

	return EXIT_SUCCESS;
};
