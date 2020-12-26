#include<stdio.h>
#define n 6
#include<string.h>
void main()
{
    int c,i,m,b,r,j;
    int a[n]={3,12,2,5,6,7};
     //memset(a,0,sizeof(a));
    for(m=0;m<5;m++)
          {

           //scanf("%d",&a[m]);
          }
        for(i=0;i<6;i++)
        {
            for(j=6;j>1;j--)
            {
              if(a[j-1]>a[j-2])
                continue;
              else
                b=a[j-1],r=a[j-2];
                a[j-1]=r,a[j-2]=b;
            for(c=0;c<6;c++)
            {
                printf("%d   ",a[c]);
            }
            printf("\n");
            }


        }
        //for(c=0;c<5;c++)
       // printf("%d ",a[c]);
}
