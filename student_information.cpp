#include<iostream>
using  namespace std;
struct student_information
{
  char st_name[20];
  int st_number;
  char st_school[30];
  char st_class[30];
};
void input(student_information & st_infor);
void output(student_information & st_infor);
void output(student_information & st_infor,int a);
int main()
{
    int j,m,st;
    m=1;
    cout<<"input the student amount"<<endl;
    cin>>st;//ѧ������
    struct student_information inf[st];
    for(j=0;j<st;j++)
    {
        cout<<"������������"<<"��"<<m<<"λͬѧ��Ϣ"<<"������������"<<endl;
        input(inf[j]);
        m++;
    }
    cout<<"the student information:"<<endl;
    cout<<"=========================="<<endl;
    for(j=0;j<st;j++)
    {
       output(inf[j]);
       output(inf[j],5);
       cout<<"=========================="<<endl;
    }
    return 0;
}
//���뺯��
void input(student_information & st_infor)
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
//��һ���������
void output(student_information &st_infor)
{
    cout<<st_infor.st_name<<"---"<<st_infor.st_number<<endl;
}
//�ڶ����������
void output(student_information &st_infor,int a)
{
    cout <<st_infor.st_class<<"---"<<st_infor.st_school<<endl;
}
