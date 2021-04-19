#include<stdio.h>     

long add(long num) {   return num + 1; }

int main(int argc, char** argv) {     
    add(argc);
    return 0;
}