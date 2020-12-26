#include <stdio.h>
#include <string.h>
#define m 10
#define n 10
void main()
{
    int i,j,s[m][n];
    memset (s,0,sizeof(s));
    for(i=0;i<10;i++)
    {
        for(j=0;j<i+1;j++)
        {
            if(j==0)
            {
            s[i][j]=1;
            printf("%d ",s[i][j]);
            }
            else
                {
                s[i][j]=s[i-1][j-1]+s[i-1][j];
                printf("%d ",s[i][j]);
                }

        }
        printf("\n");
    }

}
