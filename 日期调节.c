#include <stdio.h>  //输入一个日期，而输出该日期的下一天
void main()
{
    int a,b,c;
    scanf("%d%d%d",&a,&b,&c);   //输入你的日期
        if(b==2)                //判断输入的日期是否为2号
         {
            if(a%4==0&&a%100!=0||a%400==0)      //判断是否为闰年
             {
                if(c<29)               //在闰年的情况下判断输入的天数
             {
                    ++c;
                    printf("%d,%d,%d",a,b,c);
             }
                else
                    b++;
                    printf("%d,%d,%d",a,b,1);

             }
               else
                  if(c<28)    //在非闰年的情况下判断输入的天数
                {
                ++c;
                printf("%d,%d,%d",a,b,c);
                }

               else
                {
                        ++b;
                        printf("%d,%d,%d",a,b,1);
                }
                }
                else
                if(b==1||b==3||b==5||b==7||b==8||b==10)        //在非2月的情况下判断最大有31日的月份
                {
                if(c<31)        //判断输入的天数
                    {
                        ++c;
                        printf("%d,%d,%d",a,b,c);
                    }
                else
                    {
                        ++b;
                        printf("%d,%d,%d",a,b,1);
                    }

                }
            else
                if(b==12)   //判断输入的月份是否为12月
                    {
                    if(c<31)    //判断输入的天数
                     {
                        ++c;
                        printf("%d,%d,%d",a,b,c);
                    }
                else
                    {
                        ++a;
                        printf("%d,%d,%d",a,1,1);
                    }

                    }
                else
                    if(b==4||b==6||b==9||b==11)     //判断其他情况
                        {
                        if(c<30)
                            {++c;
                            printf("%d,%d,%d",a,b,c);}
                        else
                            {++b;
                            printf("%d,%d,%d",a,b,1);}
                        }
}
