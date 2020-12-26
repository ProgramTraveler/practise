#include <stdio.h>
void main()
{
  int a,b,c,d,i,k,h,x,y;
        b=25;
        c=15;
        d=45;
        i=0;
        k=0;
        h=0;
    snake:
    scanf("%d",&a);

    i=i+1;
    if(i<10)
        {
            if(a==b)
        printf("you are right\n");
            else if(a<b)
            {
            printf("输入的小了\n");
            goto snake;
            }
            else
            {
            printf("输入的大了\n");
            goto snake;
            }
        }
    else
        printf("正确答案是25，重新再猜一个吧\n");
        bird:
        scanf("%d",&x);

        k=k+1;
    if(k<10)
        {
            if(x==c)
        printf("you are right\n");
        else if(x<c)
            {
            printf("输入的小了\n");
            goto bird;
            }
            else
            {
            printf("输入的大了\n");
            goto bird;
            }
        }
    else
        printf("正确答案是15，重新再猜一个吧\n");
        male:
        scanf("%d",&y);

        h=h+1;
         if(h<10)
        {
            if(y==d)
        printf("you are right\n");
        else if(y<d)
            {
            printf("输入的小了\n");
            goto male;
            }
            else
            {
            printf("输入的大了\n");
            goto male;
            }
        }
        else
            printf("game over");






}
