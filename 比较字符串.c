#include<stdio.h>
int strcomopare(char *c,char *d);
void main()
{
    char a[10];
    char b[10];
    printf("the first char\n");
    gets(a);
    printf("the second char\n");
    gets(b);
    int q;
    q=strcomopare(a,b);
    printf("q:%d",q);

}
 int strcomopare(char *c,char *d)
{
  int j,u;
   for(j=0;c[j] !='\0'||d[j] !='\0';j++)
    {
        if(c[j]==d[j])
        {
            printf("c:%c  d:%c\n",c[j],d[j]);
            continue;
        }
        else
            printf("c1:%c\nd1:%c\n",c[j],d[j]);
            u=c[j]-d[j];
            break;
    }
    return u;
}
