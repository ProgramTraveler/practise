#include<stdio.h>
#include<string.h>
#define m 4
#define n 4
void main()
{
    int a[m][n],i,j,b;
      memset (a,0,sizeof(a));
       b=0;
    for(i=0;i<4;i++)
    {
        for(j=0;j<4;j++)
        {
         a[i][j]=b+1;
         b++;
        }
    }
    for(i=0;i<=3;i++)
    {
        for(j=0;j<=3;j++)
        {
            printf("%d ",a[j][i]);
        }
        printf("\n");
    }
}
