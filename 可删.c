#include<stdio.h>

void main()
{
  int x=1;
  switch(x*10)
  {
      case 9:x+1;
      case 10:x+=1; printf("%d",x);
      case 11:x+=1;printf("%d",x);
      default:x+=1;
  }
  printf("%d",x);
}
