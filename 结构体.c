#include<stdio.h>
//typedef
 struct student
{
    char name[20];
    char place[20];
    int age;
};
void main ()
{
    int k;
    struct student a[3];
    for(k=0;k<3;k++)
    {
        printf("input the name:\n");
        scanf("%s",&a[k].name);
        printf("input the place:\n");
        scanf("%s",&a[k].place);
        printf("input the age:\n");
        scanf("%d",&a[k].age);
    }
    //printf("%s\n%s\n%d",*(a.name),*(a.place),*(a.age));
    for(k=0;k<3;k++)
    {
        printf("%s  ,%s  ,%d\n",a[k].name,a[k].place,a[k].age);
    }
}
