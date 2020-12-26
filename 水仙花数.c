#include<stdio.h>
void main()
{
    int a,b,c,k;
    int m=0;    //定义m等于0,用于记录个数
    for(k=100;k<1000;k++)
    {
        a=k/100;    //a为百位
        b=k/10%10;  //b为十位
        c=k%10;     //c为个位
        if(a*a*a+b*b*b+c*c*c==k)    //判断是否为水仙花数
            m++;
            //printf("%d\n",k);
    }
    printf("%d\n",m);
}
