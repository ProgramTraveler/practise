#include<iostream>
#include <stdio.h>
#include <stdlib.h>


using namespace std;

#define FALSE 0
#define TRUE 1
int leaf_node = 0; //记录叶子个数
typedef char Datatype;
//二叉树
typedef struct Node 
{
	Datatype data;
	struct Node* LChild;
	struct Node* RChild;
} BiTNode, * BiTree;

//链栈
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

//初始化一个空栈
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

// 判断栈是否为空
int emptyStack(LinkStack* stack) 
{
	int result = 0;
	if (stack->count == 0)
	{
		result = 1;
	}
	return result;
}

// 入栈操作
int push(LinkStack* stack, BiTree tree) 
{
	SeqStack s = (SeqStack)malloc(sizeof(Stack));
	s->node = tree;
	s->next = stack->top;	/* 把当前的栈顶元素赋值给新结点的直接后继，见图中① */
	stack->top = s;         /* 将新的结点s赋值给栈顶指针，见图中② */
	stack->count++;
	return 1;
}

//出栈操作
BiTree pop(LinkStack* stack)
{
	BiTree tree;
	SeqStack p;
	if (emptyStack(stack))
	{
		return FALSE;
	}
	tree = stack->top->node;
	//将栈顶结点赋值给p
	p = stack->top;
	//使得栈顶指针下移一位，指向后一结点
	stack->top = stack->top->next;
	//释放结点p 
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
		//生成一个新结点
		*tree = (BiTree)malloc(sizeof(BiTNode));
		(*tree)->data = ch;
		//生成左子树
		createBiTree(&((*tree)->LChild));
		//生成右子树
		createBiTree(&((*tree)->RChild));

		if ((*tree)->LChild == NULL && (*tree)->RChild == NULL)
			leaf_node++;
	}
}


//中序递归遍历算法
void InOrder(BiTree T)
{
	if (T) 
	{
		InOrder(T->LChild);
		cout << T->data<<" " ;
		InOrder(T->RChild);
	}
}
//中序非递归遍历算法
void InOrder_(BiTree T)
{
	//还是模拟上面的遍历过程
	BiTree ptr[20];
	int top = -1;
	//下面的双重判断和前面的一样，在进栈、出栈的过程中可能会出现栈空的情况，而此时的遍历还没有结束，所以需要据此来维持循环的进行。
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
			cout << T->data<<" " ;   //输出在出栈后
			T = T->RChild;
		}
	}
}
//二叉树高度
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
	cout<<"按先序遍历序列建立二叉树:"<<endl;
	createBiTree(&tree);
	LinkStack stack;
	initStack(&stack);

	cout << "使用递归中序输出二叉树:" << endl;
	InOrder(tree);
	cout << endl;

	cout << "使用非递归中序输出二叉树:" << endl;
	InOrder_(tree);
	cout << endl;

	cout << "二叉树高度:" << endl;
	int num1 = 0;
	num1=GetHeight(tree);
	cout << num1 << endl;

	cout << "二叉树叶子个数" << endl;
	cout <<leaf_node<< endl;
	return 0;
}