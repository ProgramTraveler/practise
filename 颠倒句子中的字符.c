#include<stdio.h>
int main()
{
    char a[1000],b[200][200];
    gets(a);
    int i,j=0,q=0;
    for(i=0;a[i]!='\0';i++)
    {
        if(a[i]!=' ')
        {
            b[q][j]=a[i];
            j++;
        }
        else
        {
            q++;
            b[q][0]=' ';
            q++;
            j=0;
        }
    }
    for(;q>=0;q--)
    {
        printf("%s",b[q]);
    }
    return 0;
}
