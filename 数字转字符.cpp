#include<iostream>
#include<string>
#include<sstream>   //���ڽ��ַ��������ֻ���ת��
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

