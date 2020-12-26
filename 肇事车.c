#include  <stdio.h>
void main()
{
    int a, b, c,d,z,k;
    for(k=32;k<99;k++)
    {
        z =k*k;
        a = z/1000;
        b = z/100%10;
        c = z/10%10;
        d = z%10;
        if(a==b&&c==d&&a!=d)
        printf("%d",z);
    }

}
