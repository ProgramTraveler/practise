#include<iostream>
#include<string>
#include<sstream>   //���ڽ��ַ��������ֻ���ת��
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
        //addition����
int addition(const Myinteger& q)
            {
            cout<<q.value+this->value<<endl;
            return q.value+this->value;
            }
        //�ַ���ת���ֺ���
int parselnt(const string n)
            {
              stringstream k(n);
              int nu;
              k>>nu;
              cout<<"nu:"<<nu<<endl;
              cout<<nu/1000<<"ǧ"<<nu/100%10<<"��"<<nu%100/10<<"ʰ"<<nu%100%10<<endl;
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


