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
            printf("�����С��\n");
            goto snake;
            }
            else
            {
            printf("����Ĵ���\n");
            goto snake;
            }
        }
    else
        printf("��ȷ����25�������ٲ�һ����\n");
        bird:
        scanf("%d",&x);

        k=k+1;
    if(k<10)
        {
            if(x==c)
        printf("you are right\n");
        else if(x<c)
            {
            printf("�����С��\n");
            goto bird;
            }
            else
            {
            printf("����Ĵ���\n");
            goto bird;
            }
        }
    else
        printf("��ȷ����15�������ٲ�һ����\n");
        male:
        scanf("%d",&y);

        h=h+1;
         if(h<10)
        {
            if(y==d)
        printf("you are right\n");
        else if(y<d)
            {
            printf("�����С��\n");
            goto male;
            }
            else
            {
            printf("����Ĵ���\n");
            goto male;
            }
        }
        else
            printf("game over");






}
