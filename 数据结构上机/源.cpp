#include<iostream>

using namespace std;

//1.随机产生或键盘输入一组元素，建立一个带头结点的单向链表（无序）
typedef int elemtype;
typedef struct node
{
	elemtype data;
	struct node* next;
}Node,*LinkList;

void init(LinkList &l)//创建带头节点的单向链表
{
	//l = new Node;
	//l = (LinkList)malloc(sizeof(Node));
	l = NULL;
	l = new Node;
	l->next = NULL;
}

LinkList Createlist()//构建链表；
{
	LinkList l, p,q;
	l = new Node;
    p=l;
	int num;
	int n = 1;
	cout << "输入链表个数" << endl;
	cin >> num;
	cout << "输入数字" << endl;
	elemtype x;
	while (n<=num)
	{
		cin >> x;
		q = new Node;
		q->data = x;
		p->next =q;
		p=p->next;
		n++;
	}
	p->next = NULL;
	return l;
}


//2.遍历单向链表
void put(LinkList  &h)
{
	LinkList l = h;
	LinkList q=NULL;
	while (l->next != NULL)
	{
		l = l->next;
		q = l;
		cout << q->data <<"  ";
	}
	cout << endl;
}
//3.把单向链表中的元素逆置（不允许申请新的结点空间）
void inversion(LinkList& h)
{
	LinkList l = h;
	LinkList p, q;
	p = l->next;
	l->next = NULL;
	while (p)
	{
		q = p;
		p = p->next;
		q->next = l->next;
		l->next = q;
	}
	put(l);
}
//4.在单向链表中删除所有的偶数元素结点
void deletede(LinkList& h)
{
	LinkList l = h;
	LinkList q=NULL, p=NULL;
	while (l->next != NULL)
	{
		p = l->next;
		if (p->data % 2 == 0)
		{
			q = p->next;
			free(p);
			l->next = q;
		}
		else
		{
			cout << p->data << "  ";
			l = l->next;

		}
	}
	cout << endl;
}
//5.编写在非递减有序链表中插入一个元素使链表元素仍有序的函数，并利用该函数建立一个非递减有序单向链表

void insert(LinkList& h, int x)
{
	LinkList l, p, q, s;
	l = h;
	s = new Node;
	p = new Node;
	q = new Node;
	p = l->next;
	q = l;
	s->data = x;
	while ((p->data <= x) && (p->next != NULL))
	{
		p = p->next;
		q = q->next;
	}
	if (p->next == NULL)
	{
		p->next = s;
		s->next = NULL;
	}
	else
	{
		s->next = p;
		q->next = s;
	}
	cout << "插入结果：" << endl;
	put(l);
}



//6.利用算法5建立两个非递减有序单向链表，然后合成一个非递增链表
void hebing(LinkList& l, LinkList&j)
{
	LinkList Q=NULL;
	init(Q);
	LinkList pa, pb, pc;
	pa = new Node;
	pb = new Node;
	pc = new Node;
	pa = l->next;
	pb = j->next;
	pc = Q;
	pc->next = NULL;
	while (pa && pb)
	{
		if (pa->data <= pb->data)
		{
			pc->next = pa;
			pc = pa;
			pa = pa->next;
		} 
		else
		{
			pc->next = pb;
			pc = pb;
			pb = pb->next;
		}
	}
	if (pa)
	{
		pc->next = pa;
	}
	else
	{
		pc->next = pb;
	}
	free(l);
	free(j);
	inversion(Q);
}

//7.编写一个主函数调试上述算法
int main()
{

	LinkList l=Createlist();
	cout << "遍历所有节点：" << endl;
	put(l);
	cout << "删除所有偶数后：" << endl;
	deletede(l);
	cout<<"逆序后的结果：" << endl;
	inversion(l);
	cout << "-----------------------------------" << endl;
	LinkList l3 = Createlist();
	int x;
	cout << "输入要插入的值：" << endl;
	cin >> x;
	insert(l3, x);
	cout << "-----------------------------------" << endl;
	cout << "两非递减表表合成非递增表" << endl;
	LinkList l1 = Createlist();
	LinkList l2 = Createlist();
	hebing(l1, l2);

}