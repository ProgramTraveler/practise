#include<stdio.h>
//定义函数sum
int sum(int x);
void main()
{
    int n,i,k=0,s,m,p=1;
    printf("input n:\n");
    scanf("%d",&n);
    //下面这个printf是用来检查p的值
    //printf("p:%d\n",p);
    //下面这个循环是用来比较不等式，建议开始不要用n,用一个实数,当确定循环能用后再换成 n
    for(i=1;i<n;i++)
    {
        //下面这个k 的值代表前几个数的和
        k=k+sum(i);
        //下面的printf也是检查k 的值
        //printf("k:%d\n",k);
        //下面的判断不等式成立的条件
        if(k>n)
        {
            //当和大于输入的数时,输出前一个数,即i-1
           printf("m:%d\n",i-1);
           break;
        }
        else
            if(k==n)
                {
                    printf("无解\n");
                    break;
                }
            else
                continue;
    }
}
//函数sum用来求一个数的阶乘
int sum(int x)
{
    int a,b,c;
    a=x;
    c=x-1;
    if(c==0)
        a=x;
    else
    {
        //实现阶乘
        for(b=0;b<x;b++)
        {
            if(c>0)
                {
                    //实现前一个数乘以比它小的数
                    a=a*c;
                    c--;
                }
            else
                break;

        }
    }
    //检查a的值
    //printf("a:%d\n",a);
    return a;

}
