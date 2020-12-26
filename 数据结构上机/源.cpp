#include<iostream>

using namespace std;

//1.����������������һ��Ԫ�أ�����һ����ͷ���ĵ�����������
typedef int elemtype;
typedef struct node
{
	elemtype data;
	struct node* next;
}Node,*LinkList;

void init(LinkList &l)//������ͷ�ڵ�ĵ�������
{
	//l = new Node;
	//l = (LinkList)malloc(sizeof(Node));
	l = NULL;
	l = new Node;
	l->next = NULL;
}

LinkList Createlist()//��������
{
	LinkList l, p,q;
	l = new Node;
    p=l;
	int num;
	int n = 1;
	cout << "�����������" << endl;
	cin >> num;
	cout << "��������" << endl;
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


//2.������������
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
//3.�ѵ��������е�Ԫ�����ã������������µĽ��ռ䣩
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
//4.�ڵ���������ɾ�����е�ż��Ԫ�ؽ��
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
//5.��д�ڷǵݼ����������в���һ��Ԫ��ʹ����Ԫ��������ĺ����������øú�������һ���ǵݼ�����������

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
	cout << "��������" << endl;
	put(l);
}



//6.�����㷨5���������ǵݼ�����������Ȼ��ϳ�һ���ǵ�������
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

//7.��дһ�����������������㷨
int main()
{

	LinkList l=Createlist();
	cout << "�������нڵ㣺" << endl;
	put(l);
	cout << "ɾ������ż����" << endl;
	deletede(l);
	cout<<"�����Ľ����" << endl;
	inversion(l);
	cout << "-----------------------------------" << endl;
	LinkList l3 = Createlist();
	int x;
	cout << "����Ҫ�����ֵ��" << endl;
	cin >> x;
	insert(l3, x);
	cout << "-----------------------------------" << endl;
	cout << "���ǵݼ����ϳɷǵ�����" << endl;
	LinkList l1 = Createlist();
	LinkList l2 = Createlist();
	hebing(l1, l2);

}