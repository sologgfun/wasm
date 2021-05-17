#include<stdio.h>     

long add(long num) {   return num + 15; }

int main(int argc,char** argv)
{
    printf("%d\n",argc);
    printf("%s\n",argv[0]);
    printf("%s\n",argv[1]);
    printf("%s\n",argv[2]);
}
