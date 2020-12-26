#include<stdio.h>
int snake(int k);
void main()
{
    int a,sum;
    scanf("%d",&a);
    sum=snake(a);
    printf("%d",sum);
    //markfactor
}
int snake(int k)
{
    int i=2,j,c,b=0;
    while(sqrt(k)>=i)
    {
        c=k%i;
        if(c==0)
        {
            k=k/i;
            //k=j;
            b=b+i;
            printf("%d\n",i);
            printf("k:%d\n",k);
        }
        else
            {
                i++;
            }
        printf("i:%d\n",i);
    }
    if(k>1)
    {
        b+=k;
    }

     return b;
}
