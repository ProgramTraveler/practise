#include<stdio.h>
#define j 18
char word(int n);
void main()
{
     float x;
    scanf("%f",&x);
    //printf("%f\n",x);
    char  *p=0;
    char b[j];
        p=b;
    //x=2454.34;
     int y;
     y=x*100;
     //printf("y:%d\n",y);
    int h,c,d,e,f,g;
    h=y/100000;
    c=y/10000%10;
    d=y/1000%10;
    e=y%1000/100;
    f=y%100/10;
    g=y%100%10;
    //printf("%d%5d%5d%5d%5d%5d\n",h,c,d,e,f,g);
    if(h!=0)
        {
            *p=word(h);
            printf("%cǧ",*p);
        }
    if(c!=0)
        {
            {
                *p=word(c);
                printf("%c��",*p);
            }
        }
      else
        printf("   �� �� ");
     if(d!=0)
        {
            *p=word(d);
            printf("%cʰ",*p);
        }
      else printf("   �� ʰ ");
     if(e!=0)
        {
            *p=word(e);
            printf("%cԪ",*p);
        }
        else printf("   �� Ԫ");
      if(f!=0)
        {
            *p=word(f);
            printf("%c��",*p);
        }
        else
            printf("   �� ��");
      if(g!=0)
        {
            *p=word(g);
            printf("%c��",*p);
        }
        else
            printf("   �� ��");
}
char word(int n)
{
    char a[9][9]={"Ҽ","��","��","��","��","½","��","��","��"};
    int i;
    for(i=1;i<10;i++)
    {
        if(i=n)
            i--;
            printf("%5s",a[i]);
            break;
    }
    return 0;
}
