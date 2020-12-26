#include <stdio.h>
void main()
{
    int a,b,c,x,y,k,j;
        j=0;
    for(k=100;k<300;k++)
        {a=k/100;
        b=k/10%10;
        c=k%10;
            x=c*100+b*10+a;
            y=x/k;
             if(y>=2)
             {

             j++;
            printf("\n%d",k);
             }
         printf("    %d",j);
        }


}
