#include<stdio.h>
void main()
{
    int a,b,c,k;
    int m=0;    //����m����0,���ڼ�¼����
    for(k=100;k<1000;k++)
    {
        a=k/100;    //aΪ��λ
        b=k/10%10;  //bΪʮλ
        c=k%10;     //cΪ��λ
        if(a*a*a+b*b*b+c*c*c==k)    //�ж��Ƿ�Ϊˮ�ɻ���
            m++;
            //printf("%d\n",k);
    }
    printf("%d\n",m);
}
