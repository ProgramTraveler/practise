#include<stdio.h>
#define i 5
int sum(int k);
int a[i];
void main()
{
    int n,s,arv,m,l,w,b,e,f,h,x,d;
    printf("�������\n");
    for(n=0;n<5;n++)//�����ı䣬������֤��
        {
            scanf("%d",&a[n]);
             if(a[n]<0)
                break;
            else
                continue;
        }
    s=sum(5);//
    arv=s/5;//
    printf("ƽ����:%d\n",arv);
    m=0;
    for(l=0;l<5;l++)//�����ı䣬������֤��
    {
        if(a[l]<60)
            {
                m++;
                printf("������:%d,  num:%d\n",a[l],l+1);
            }
        else
            continue;
    }
    printf("   ����������:%d\n",m);
    w=0;
    for(b=0;b<5;b++)//�����ı䣬������֤��
    {
        if(a[b]>=arv)
            {
                w++;
                printf("ƽ�������ϵķ���:%d,  num:%d\n",a[b],b+1);
            }
        else
            continue;
    }
    printf("   ƽ�������ϵ�����:%d\n",w);
    e=f=h=x=0;
    for(d=0;d<5;d++)//
    {
        switch(a[d]/10)
        {
            case 10:
            case 9: e++; break;
            case 8: f++; break;
            case 7: h++; break;
            case 6: x++; break;
        }
    }
    float q,o,p,t,j;
    q=(e*100)/5;
    o=(f*100)/5;
    p=(h*100)/5;
    t=(x*100)/5;
    j=(m*100)/5;
    printf("90������:%d,  ��ռ�ٷֱ�:%f%%\n",e,q);
    printf("80������:%d,  ��ռ�ٷֱ�:%f%%\n",f,o);
    printf("70������:%d,  ��ռ�ٷֱ�:%f%%\n",h,p);
    printf("60������:%d,  ��ռ�ٷֱ�:%f%%\n",x,t);
    printf("60������:%d,  ��ռ�ٷֱ�:%f%%\n",m,j);
}
int sum(int k)
{
    int g,c;
    c=0;
    for(g=0;g<k;g++)
    {
        c=c+a[g];
    }
    return c;
}
