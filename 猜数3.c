#include <stdio.h>
#include<windows.h>
//#include "pch.h"
void main()
{
    int a,b,c;
        b=25,c=0;
        snake:
        c=c+1;
    scanf("%d",&a);
    if(c>9)
        printf("game over");
         system("pause");
    else if(a==b)
        printf("you are right");
         system("pause");
    else if(a<b)
            {
            printf("�����С��\n");
            goto snake;
            }
        else
            {
            printf("�����������\n");
            goto snake;
            }
    system("pause");
}
