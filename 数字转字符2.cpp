#include<iostream>
#include<string>
#include<sstream>   //用于将字符串和数字互相转换
#include"myinteger.h"
using namespace std;
class Myinteger
{
    public:
    int get(int a)
            {
            value=++a;
            cout<<"value:"<<value<<endl;
            return value;
            }
        //addition函数
int addition(const Myinteger& q)
            {
            cout<<q.value+this->value<<endl;
            return q.value+this->value;
            }
        //字符串转数字函数
int parselnt(const string n)
            {
              stringstream k(n);
              int nu;
              k>>nu;
              cout<<"nu:"<<nu<<endl;
              cout<<nu/1000<<"千"<<nu/100%10<<"百"<<nu%100/10<<"拾"<<nu%100%10<<endl;
              return nu;
            }
Myinteger(const int& w)
            {
                value=w;
            }
Myinteger()
            {
                value=10;
            }
    private:
        int value;
        double sum;

};
int main()
{
    Myinteger number1;
    Myinteger number2(2);
    number2.parselnt("1234");
    cout<<number2.addition(number1)<<endl;
    return 0;
}


