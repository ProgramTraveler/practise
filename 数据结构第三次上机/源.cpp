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

    int top; //记录栈顶数字
    int bottom; //记录栈底数字
    int data[MAX]; //记录数据

} Stack;

//栈的初始化（创建一个新栈）
void InitStack(Stack& st) 
{

    st.top = 0;
    st.bottom = 0;
    memset(st.data, 0, sizeof(st.data));
}

//出栈操作
int StackPop(Stack& st)
{
    //判断是否到栈底
    if (st.top != st.bottom) 
    {
        st.top--;
        return st.data[st.top + 1];
    }

}
//入栈操作
void StackPush(Stack& st, int data)
{    
     st.top++;
     st.data[st.top] = data;
}


//判断栈是否为空（运算表达式）
int isEmpty()
{
    return top_p == -1 ? 1 : 0;
}


//获得栈顶数据
int getTop() 
{
    if (top_p < MAX)
        return stack_k[top_p];
    exit(1);
}

//将运算表达式入栈
void Push(int e) 
{
    if (top_p >= MAX)
    {
        cout << "栈已满" << endl;;
        exit(1);
    }
    stack_k[++top_p] = e;

}

//将运算表达式出栈
int Pop() 
{
    if (top_p == -1) 
    {
        cout << "这是一个空栈。" << endl;
        exit(1);
    }
    return stack_k[top_p--];
}


int judgePriority(char op1, char op2) 
{
    // 1 先出栈， 再进栈
    // 0 直接进栈
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
        // 数字
        if (p[i] >= '0' && p[i] <= '9')
            str[j++] = p[i];
        // 字符
        else {
            op1 = getTop();
            op2 = p[i];
            if (isEmpty())
                Push(op2);
            // 非空
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
    cout << "输入运算表达式：" << endl;
    gets_s(tmp);
    infix2postfix(tmp, str);
    puts(str);
    printf("%s = %d\n", tmp, calc(str));


    cout << endl;
    Stack st;
    cout << "初始化栈" << endl;
    InitStack(st);
    int data;
    //输入数据，输入0结束
    cout << "输入入栈数据,输入0结束" << endl;
    cin >> data;
    while (data != 0)
    {
        //将数据入栈
        StackPush(st, data);
        cin >> data;
    }
    //将数据出栈
    while (st.top != st.bottom)
    {
        cout << StackPop(st) << " ";
    }

    return 0;
}



