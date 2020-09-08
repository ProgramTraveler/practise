#include <iostream>
struct student_information
{
  char st_name[20];
  int st_number;
  char st_school[30];
  char st_class[30];
};
void input(student_information &st_infor);
void output(student_information &st_infor);
void output(student_information &st_infor,int a);
void input(student_information &st_infor)
{
        cout<<"input the student name"<<endl;
            cin>>st_infor.st_name;
            cout<<"---------------------\n";
        cout<<"input the student number"<<endl;
            cin>>st_infor.st_number;
            cout<<"---------------------\n";
        cout<<"input the student class"<<endl;
            cin>>st_infor.st_class;
            cout<<"---------------------\n";
        cout<<"input the student school"<<endl;
            cin>>st_infor.st_school;
            cout<<"---------------------\n";
    }
}
void output(student_information &st_infor)
{
    cout<<st_infor.st_name<<"---"<<st_infor.st_number<<endl;
}
void output(student_information &st_infor)
{
    cout <<st_infor.st_class<<"---"<<st_infor.st_school<<endl;
}
int main()
{
    using  namespace std;
    int j,m,f,num1;
    m=1;
    int st=2;//学生人数
    struct student_information inf[st];
    for(j=0;j<st;j++)
    {
        cout<<"*****"<<"第"m"位同学信息"<<"*****"<<endl;
        input(inf[j]);
        m++;
    }
    for(j=0;j<st;j++)
    {
       output(inf[j]);
       output(inf[j],5);
    }
    cout<<"---------------------------------------------------------"<<endl;
    return 0;
}
