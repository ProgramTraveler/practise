#include <stdio.h>
void main()
{
    double a,b,sum,k;
    sum=0;
    a=3.0,b=1.0;
    for(k=1.0;k>1.0E-18;a+=2,b+=1)
    {
        sum+=k;
        k=k*b/a;
    }
        printf("%f",sum*2);
}
