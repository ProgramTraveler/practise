#include<stdio.h>
#include<string.h>
int snake(int q);
int agony(int p);
#define n 6
void main()
{
    int a[5]={2,5,7,10,25},b,c[n],s,i,j,v;
    memset(c,0,sizeof(c));
    int snake(int q)
    {

    for(i=q;i<=0;i--)
        {
            c[i+1]=a[i];
            v=i+1;
            //c[4]=10;c[5]=25;
        return c[v];
        }
    }
    int agony(int p)
    {

        for(j=p;j<=0;j--)
            {
                c[j]=a[j];
            //c[1]=a[1],c[2]=a[2];c[3]=a[3],c[4]=a[4];
            return c[j];
            }
    }

     scanf("%d",&b);
    if(b<=a[2])
        {
        if(b<=a[1])
            {
            if(b<=a[0])
                {


                    c[0]=b;
                    snake(4);
                }
            else

                c[0]=a[0],c[1]=b;
                c[n]=snake(3);
            }
        else

            c[0]=a[0],c[1]=a[1],c[2]=b;
            c[n]=snake(2);

        }
     else   {
            if(b>=a[3])
                {
                if(b>=a[4])
                    {
                    c[5]=b;
                    c[n]=agony(4);
                    }
                else

                    c[4]=b,c[5]=a[4];
                    c[n]=agony(3);
                }
            else

            c[3]=b,c[4]=a[3],c[5]=a[4];
            c[n]=agony(2);
            }
            for(s=0;s<6;s++)
            printf("%d   ",c[s]);
}
