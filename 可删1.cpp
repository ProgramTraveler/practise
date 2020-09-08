#include <iostream>
#include<string>
using namespace std;

struct student{

   int m_number;
   string m_name;
   string m_school;
   string m_class;
};
void input(student  &t_student);
void output(const student &t_student);
void output(const student &t_student,int a);
int main()
{
    student studentInfo[5];
    for(int a=0;a<5;a++){           //输入学生信息
        input(studentInfo[a]);
    }
    for(int a=0;a<5;a++){           //
        output(studentInfo[a]);
        output(studentInfo[a],0);
    }

    return 0;
}
void input(student  &t_student){  //设置学生信息

    cout<<"请输入学生的名字"<<endl;
    cin>>t_student.m_name;
    cout<<"请输入学生学号"<<endl;
    cin>>t_student.m_number;
    cout<<"请输入学生班级"<<endl;
    cin>>t_student.m_class;
    cout<<"请输入学生的学校"<<endl;
    cin>>t_student.m_school;
}
void output(const student &t_student){
    cout<<"学生姓名:  "<<t_student.m_name<<endl;
    cout<<"学生学号:  "<<t_student.m_number<<endl;
}
void output(const student &t_student,int a){

    cout<<"学生班级:  "<<t_student.m_class<<endl;
    cout<<"学生学校:  "<<t_student.m_school<<endl;
    cout<<a<<"*************************"<<a<<endl;
}
