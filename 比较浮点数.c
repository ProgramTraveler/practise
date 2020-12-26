#include<stdio.h>
int main()
{
    double a[1];
    int i;
    for(i=0;i<2;i++)
    {
        scanf("%f",&a[i]);
    }
    if(a[0]==a[1])
    {
        printf("yes");
    }
    else
        printf("no");
    return 0;
}
