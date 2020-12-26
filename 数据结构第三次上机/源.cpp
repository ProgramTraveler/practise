#include<iostream>
#include<stack>
#include<string.h>
#include<stdio.h>
#include <stdlib.h>
using namespace std;

# define MAX 512


int top_p = -1;
int stack_k[512];


typedef struct 
{

    int top; //��¼ջ������
    int bottom; //��¼ջ������
    int data[MAX]; //��¼����

} Stack;

//ջ�ĳ�ʼ��������һ����ջ��
void InitStack(Stack& st) 
{

    st.top = 0;
    st.bottom = 0;
    memset(st.data, 0, sizeof(st.data));
}

//��ջ����
int StackPop(Stack& st)
{
    //�ж��Ƿ�ջ��
    if (st.top != st.bottom) 
    {
        st.top--;
        return st.data[st.top + 1];
    }

}
//��ջ����
void StackPush(Stack& st, int data)
{    
     st.top++;
     st.data[st.top] = data;
}


//�ж�ջ�Ƿ�Ϊ�գ�������ʽ��
int isEmpty()
{
    return top_p == -1 ? 1 : 0;
}


//���ջ������
int getTop() 
{
    if (top_p < MAX)
        return stack_k[top_p];
    exit(1);
}

//��������ʽ��ջ
void Push(int e) 
{
    if (top_p >= MAX)
    {
        cout << "ջ����" << endl;;
        exit(1);
    }
    stack_k[++top_p] = e;

}

//��������ʽ��ջ
int Pop() 
{
    if (top_p == -1) 
    {
        cout << "����һ����ջ��" << endl;
        exit(1);
    }
    return stack_k[top_p--];
}


int judgePriority(char op1, char op2) 
{
    // 1 �ȳ�ջ�� �ٽ�ջ
    // 0 ֱ�ӽ�ջ
    if (op1 == '(' || op2 == '(')
        return 0;
    if ((op1 == '-' || op1 == '+') && (op2 == '*' || op2 == '/'))
        return 0;
    return 1;
}


void infix2postfix(char* tmp, char* str) {
    char* p = tmp;
    int i, j, k;
    char op1, op2;
    j = 0;
    for (i = 0; p[i]; i++) {
        // ����
        if (p[i] >= '0' && p[i] <= '9')
            str[j++] = p[i];
        // �ַ�
        else {
            op1 = getTop();
            op2 = p[i];
            if (isEmpty())
                Push(op2);
            // �ǿ�
            else {
                if (op2 == ')') {
                    while (getTop() != '(')
                        str[j++] = Pop();
                    Pop();
                    continue;
                }
                switch (judgePriority(op1, op2)) {
                case  1: str[j++] = Pop();
                    for (k = 0; k <= top_p; k++) {
                        if (!judgePriority(op1, op2)) break;
                        str[j++] = Pop();
                    }
                    Push(op2);
                    break;
                case  0:  Push(op2); break;
                }
            }
        }
    }

    while (!isEmpty())
        str[j++] = Pop();
    str[j] = 0;
}

int calc(char* buf) {
    int i, k, j;
    for (i = 0; buf[i]; i++) {
        switch (buf[i]) {
        case '+':
            k = Pop() + Pop();
            Push(k);
            break;
        case '-':
            j = Pop();
            k = Pop() - j;
            Push(k);
            break;
        case '*':
            k = Pop() * Pop();
            Push(k);
            break;
        case '/':
            j = Pop();
            k = Pop() / j;
            Push(k);
            break;
        default:
            Push(buf[i] - 48);
        }
    }
    return Pop();

}

int main()
{

    char tmp[512]= "9-2*2+(9-8)";
    char str[512];
    cout << "����������ʽ��" << endl;
    gets_s(tmp);
    infix2postfix(tmp, str);
    puts(str);
    printf("%s = %d\n", tmp, calc(str));


    cout << endl;
    Stack st;
    cout << "��ʼ��ջ" << endl;
    InitStack(st);
    int data;
    //�������ݣ�����0����
    cout << "������ջ����,����0����" << endl;
    cin >> data;
    while (data != 0)
    {
        //��������ջ
        StackPush(st, data);
        cin >> data;
    }
    //�����ݳ�ջ
    while (st.top != st.bottom)
    {
        cout << StackPop(st) << " ";
    }

    return 0;
}



