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
    for(int a=0;a<5;a++){           //����ѧ����Ϣ
        input(studentInfo[a]);
    }
    for(int a=0;a<5;a++){           //
        output(studentInfo[a]);
        output(studentInfo[a],0);
    }

    return 0;
}
void input(student  &t_student){  //����ѧ����Ϣ

    cout<<"������ѧ��������"<<endl;
    cin>>t_student.m_name;
    cout<<"������ѧ��ѧ��"<<endl;
    cin>>t_student.m_number;
    cout<<"������ѧ���༶"<<endl;
    cin>>t_student.m_class;
    cout<<"������ѧ����ѧУ"<<endl;
    cin>>t_student.m_school;
}
void output(const student &t_student){
    cout<<"ѧ������:  "<<t_student.m_name<<endl;
    cout<<"ѧ��ѧ��:  "<<t_student.m_number<<endl;
}
void output(const student &t_student,int a){

    cout<<"ѧ���༶:  "<<t_student.m_class<<endl;
    cout<<"ѧ��ѧУ:  "<<t_student.m_school<<endl;
    cout<<a<<"*************************"<<a<<endl;
}
