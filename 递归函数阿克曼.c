#include<stdio.h>
int Ack(int m,int n);
void main()
{
    int a,m,n;
    scanf("%d%d",&m,&n);
    if(m>=0&&n>=0)
    {
        a=Ack(m,n);
        printf("%d",a);
    }
    else
        printf("wrong");
}
int Ack(int m,int n)
{
    if(m==0)
        return n+1;
    else
        if(n==0)
        {
            return Ack(m-1,1);
        }
        else
            return Ack(m-1,Ack(m,n-1));

}
