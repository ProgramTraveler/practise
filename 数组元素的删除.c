#include<stdio.h>   //�ó����޷�ɾ����������
#define i 5
int fun(int *f,int *n,int y);
void main()
{
 int j,m,c,a[i];
 printf("������:\n");
 for(j=0;j<i;j++)
    {
        scanf("%d",&a[j]);
    }
 int  q=5;
 printf("����ɾ����:\n");
 scanf("%d",&m);
 c=fun(a,&q,m);
 printf("\nʣ�����%d\n",c);
}
int fun(int *f,int *n,int y)
{
    int  *p,*last;
    int r=0;
    last=f+5;
    for(p=f;p<last;p++)
    {
            if(y==*p)
                {
                    *n=(*n)-1;
                    r++;
                }
    }
    for(p=f;p<last;p++)
    {
        if(y==*p)
        {
            for(p++;p<last;++p)
                {
                    //*p=*(p+1);
                    *(p-1)=*p;
                }
            p=f;
        }
    }
    for(p=f;p<last;p++)
     {

         for(;p<last-r;++p)
                {
                    printf("%5d",*p);
                }

     }
    return *n;
}
