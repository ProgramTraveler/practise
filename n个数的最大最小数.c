#include<stdio.h>
int main()
{
    int n;
    scanf("%d\n",&n);
    int a[n];
    int i;
    for(i=0;i<n;i++)
    {
        scanf("%d",&a[i]);
    }
    int b,c;
    int j;
    b=c=a[0];
    for(j=1;j<n;j++)
    {
        if(b<=a[j])
        {
           b=a[j];
        }
        if(c>=a[j])
        {
            c=a[j];
        }
    }
    printf("%d,%d",c,b);
    return 0;
}
