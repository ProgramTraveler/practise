#include<iostream>
#include<string>
#include<sstream>   //用于将字符串和数字互相转换
#include"myinteger.h"
using namespace std;
int main()
{
    myinteger number1;
    myinteger number2(30);
    number1.parselnt("1234");
    //cout<<number2.addition(number1)<<endl;
    return 0;
}

