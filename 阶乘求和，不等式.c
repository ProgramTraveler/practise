#include<stdio.h>
//���庯��sum
int sum(int x);
void main()
{
    int n,i,k=0,s,m,p=1;
    printf("input n:\n");
    scanf("%d",&n);
    //�������printf���������p��ֵ
    //printf("p:%d\n",p);
    //�������ѭ���������Ƚϲ���ʽ�����鿪ʼ��Ҫ��n,��һ��ʵ��,��ȷ��ѭ�����ú��ٻ��� n
    for(i=1;i<n;i++)
    {
        //�������k ��ֵ����ǰ�������ĺ�
        k=k+sum(i);
        //�����printfҲ�Ǽ��k ��ֵ
        //printf("k:%d\n",k);
        //������жϲ���ʽ����������
        if(k>n)
        {
            //���ʹ����������ʱ,���ǰһ����,��i-1
           printf("m:%d\n",i-1);
           break;
        }
        else
            if(k==n)
                {
                    printf("�޽�\n");
                    break;
                }
            else
                continue;
    }
}
//����sum������һ�����Ľ׳�
int sum(int x)
{
    int a,b,c;
    a=x;
    c=x-1;
    if(c==0)
        a=x;
    else
    {
        //ʵ�ֽ׳�
        for(b=0;b<x;b++)
        {
            if(c>0)
                {
                    //ʵ��ǰһ�������Ա���С����
                    a=a*c;
                    c--;
                }
            else
                break;

        }
    }
    //���a��ֵ
    //printf("a:%d\n",a);
    return a;

}
