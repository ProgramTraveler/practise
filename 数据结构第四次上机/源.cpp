#include<iostream>
#include <stdio.h>
#include <stdlib.h>


using namespace std;

#define FALSE 0
#define TRUE 1
int leaf_node = 0; //��¼Ҷ�Ӹ���
typedef char Datatype;
//������
typedef struct Node 
{
	Datatype data;
	struct Node* LChild;
	struct Node* RChild;
} BiTNode, * BiTree;

//��ջ
typedef struct Stack 
{
	struct Node* node;
	struct Stack* next;
} Stack, * SeqStack;
typedef struct 
{
	SeqStack top;
	int count;
} LinkStack;

//��ʼ��һ����ջ
int initStack(LinkStack* stack)
{
	stack->top = (SeqStack)malloc(sizeof(Stack));
	if (!stack->top) 
	{
		return FALSE;
	}
	stack->top = NULL;
	stack->count = 0;
	return TRUE;
}

// �ж�ջ�Ƿ�Ϊ��
int emptyStack(LinkStack* stack) 
{
	int result = 0;
	if (stack->count == 0)
	{
		result = 1;
	}
	return result;
}

// ��ջ����
int push(LinkStack* stack, BiTree tree) 
{
	SeqStack s = (SeqStack)malloc(sizeof(Stack));
	s->node = tree;
	s->next = stack->top;	/* �ѵ�ǰ��ջ��Ԫ�ظ�ֵ���½���ֱ�Ӻ�̣���ͼ�Т� */
	stack->top = s;         /* ���µĽ��s��ֵ��ջ��ָ�룬��ͼ�Т� */
	stack->count++;
	return 1;
}

//��ջ����
BiTree pop(LinkStack* stack)
{
	BiTree tree;
	SeqStack p;
	if (emptyStack(stack))
	{
		return FALSE;
	}
	tree = stack->top->node;
	//��ջ����㸳ֵ��p
	p = stack->top;
	//ʹ��ջ��ָ������һλ��ָ���һ���
	stack->top = stack->top->next;
	//�ͷŽ��p 
	free(p);
	stack->count--;
	return tree;
}

void createBiTree(BiTree* tree)
{
	char ch;
	ch = getchar();
	if (ch == ' ')
	{
		*tree = NULL;
	}
	else 
	{
		//����һ���½��
		*tree = (BiTree)malloc(sizeof(BiTNode));
		(*tree)->data = ch;
		//����������
		createBiTree(&((*tree)->LChild));
		//����������
		createBiTree(&((*tree)->RChild));

		if ((*tree)->LChild == NULL && (*tree)->RChild == NULL)
			leaf_node++;
	}
}


//����ݹ�����㷨
void InOrder(BiTree T)
{
	if (T) 
	{
		InOrder(T->LChild);
		cout << T->data<<" " ;
		InOrder(T->RChild);
	}
}
//����ǵݹ�����㷨
void InOrder_(BiTree T)
{
	//����ģ������ı�������
	BiTree ptr[20];
	int top = -1;
	//�����˫���жϺ�ǰ���һ�����ڽ�ջ����ջ�Ĺ����п��ܻ����ջ�յ����������ʱ�ı�����û�н�����������Ҫ�ݴ���ά��ѭ���Ľ��С�
	while (T || top != -1) 
	{
		while (T)
		{
			ptr[++top] = T;
			T = T->LChild;
		}
		if (top != -1)
		{
			T = ptr[top--];
			cout << T->data<<" " ;   //����ڳ�ջ��
			T = T->RChild;
		}
	}
}
//�������߶�
int GetHeight(BiTree T)
{
	int len1, len2;
	if (T == NULL) return 0;
	len1 = GetHeight(T->LChild);
	len2 = GetHeight(T->RChild);
	if (len1 > len2) return len1 + 1;
	else return len2 + 1;
}


int main(int argc, char* argv[])
{
	BiTree tree;
	cout<<"������������н���������:"<<endl;
	createBiTree(&tree);
	LinkStack stack;
	initStack(&stack);

	cout << "ʹ�õݹ��������������:" << endl;
	InOrder(tree);
	cout << endl;

	cout << "ʹ�÷ǵݹ��������������:" << endl;
	InOrder_(tree);
	cout << endl;

	cout << "�������߶�:" << endl;
	int num1 = 0;
	num1=GetHeight(tree);
	cout << num1 << endl;

	cout << "������Ҷ�Ӹ���" << endl;
	cout <<leaf_node<< endl;
	return 0;
}