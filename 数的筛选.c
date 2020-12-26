#include<stdio.h>
int fun(int *a,int n);
#define i 20
void main()
{
    int m,b[i],w,h;
    scanf("%d",&m);
    h=m+1;
    w=fun(&b,h);
    printf("¸öÊı:%d\n",w);
}
int fun(int*a,int n)
{
    int j,c=0;
    for(j=1;j<n;j++)
    {
        if(j!=77)
            if(j%7==0||j%11==0)
            {
                *a=j;
                 printf("ÔªËØ:%d\n",*a);
                c++;
                *a++;
            }

    }
    return c;
}
