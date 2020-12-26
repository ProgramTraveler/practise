#include<stdio.h>
int main()
{
    int n,m;
    int c=0;
    printf("scanf the num\n");
    scanf("%d",&n);
    int a[n];
    printf("scanf the number\n");
    int i;
    for(i=0;i<n;i++)
    {
        scanf("%d",&a[i]);
    }
    int j;
    for(j=0;j<n;j++)
    {
        int b;
        b=a[j];
        c=c+b;
    }
    printf("sum=%d",c);
    return 0;
}
