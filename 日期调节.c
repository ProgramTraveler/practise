#include <stdio.h>  //����һ�����ڣ�����������ڵ���һ��
void main()
{
    int a,b,c;
    scanf("%d%d%d",&a,&b,&c);   //�����������
        if(b==2)                //�ж�����������Ƿ�Ϊ2��
         {
            if(a%4==0&&a%100!=0||a%400==0)      //�ж��Ƿ�Ϊ����
             {
                if(c<29)               //�������������ж����������
             {
                    ++c;
                    printf("%d,%d,%d",a,b,c);
             }
                else
                    b++;
                    printf("%d,%d,%d",a,b,1);

             }
               else
                  if(c<28)    //�ڷ������������ж����������
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
                if(b==1||b==3||b==5||b==7||b==8||b==10)        //�ڷ�2�µ�������ж������31�յ��·�
                {
                if(c<31)        //�ж����������
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
                if(b==12)   //�ж�������·��Ƿ�Ϊ12��
                    {
                    if(c<31)    //�ж����������
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
                    if(b==4||b==6||b==9||b==11)     //�ж��������
                        {
                        if(c<30)
                            {++c;
                            printf("%d,%d,%d",a,b,c);}
                        else
                            {++b;
                            printf("%d,%d,%d",a,b,1);}
                        }
}
