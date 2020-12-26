#include<stdio.h>
int age(int x);
void main()
{
    printf("这个人的年龄为%d岁",age(5));
}
int age(int x)
{
    int a;
    if(x==1)
        return a=10;
    else
        a=age(x-1)+2;
    return a;
}
