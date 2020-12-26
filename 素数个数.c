#include<stdio.h>
int snake(int k,int h);
void main()
{
    int num,m,n;
    scanf("%d%d",&m,&n);
    if(m>n)
    {
        int a,b;
        a=m,b=n;
        m=b,n=a;
        m=m+1;
        num=snake(m,n);
    }
    else
    {
        m=m+1;
        num=snake(m,n);
    }
    printf("num:%d",num);
}
int snake(int k,int h)
{
    int i,j=0,l;
        for(i=k;i<h;i++)
        {
            for(l=2;l<h;l++)
                {
                    if(i%l==0&&i==l)
                        {
                            j++;
                            printf("i:%d\n",i);
                        }
                    else
                        if(i%l==0)
                            break;
                        else
                            continue;

                }
        }
    return j;
}
