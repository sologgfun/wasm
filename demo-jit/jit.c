#include<stdio.h>                                                                                            
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/mman.h>

//一个程序在它运行的时候创建并且运行了全新的代码，而并非那些最初作为这个程序的一部分保存在硬盘上的固有的代码。就叫 JIT。

//但是这个代码似乎有问题，算了先不纠结了

//分配内存
void* create_space(size_t size) {
    void* ptr = mmap(0, size,
            PROT_READ | PROT_WRITE | PROT_EXEC,
            MAP_PRIVATE | MAP_ANON,
            -1, 0);   
    return ptr;
}

//在内存中创建函数
void copy_code_2_space(unsigned char* addr) {
    unsigned char macCode[] = {
       0x48, 0x83, 0xc0, 0x01, 0xc3
    };
    memcpy(addr, macCode, sizeof(macCode));
}

//main 声明一个函数指针TestFun用来指向我们的求和函数在内存中的地址
int main(int argc, char** argv) {                                                                                              
    const size_t SIZE = 1024;
    typedef long (*TestFun)(long);
    void* addr = create_space(SIZE);
    copy_code_2_space(addr);
    TestFun test = addr;
    int result = test(1);
    printf("result = %d\n", result); 
    return 0;
}