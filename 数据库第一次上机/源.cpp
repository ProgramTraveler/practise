#include<iostream>

using namespace std;

#define Listinitsize 50

typedef struct
{
	int* base;       //�洢�ռ��ַ
	int length;      //��ǰ����
	int listsize;    //��ǰ�洢����
}Sqlist;

//1.�������Ա�
void initList(Sqlist& L)
{
	L.base = (int*)malloc(Listinitsize * sizeof(int));
	if (!L.base)
		exit(0);
	L.listsize = Listinitsize;
	cout << "�������Ա���" << endl;
	cin >> L.length;
	cout << "����" << L.length << "��Ԫ��" << endl;
	for (int i = 0; i < L.length; i++)
	{
		cin >> L.base[i];
	}
}

//2.ʵ�ָ�˳���ı�����
void traversalList(Sqlist& L)
{
	cout << "�������Ա�" << endl;
	for (int i = 0; i < L.length; i++)
	{
		cout << L.base[i] << "  ";
	}
	cout << endl;
}
//3.�ڸ�˳����н���˳�����ĳһԪ��,���ҳɹ�����1,���򷵻�0��
int locateList(Sqlist& L, int e)
{
	int i = 0;
	while (i < L.length)
	{
		if (L.base[i] == e)
		{
			cout << "����Ԫ��" << e << "�ڵ�" << i + 1 << "λ" << endl;
			return 1;
			break;
		}
		else
			i++;
	}

	cout << "����Ԫ�ز��ڱ���" << endl;
	return 0;

}
//4.�жϸ�˳�����Ԫ���Ƿ�Գ�,�ԳƷ���1,���򷵻�0��
int symmetry(Sqlist& L)
{
	int a = L.length;
	if (a % 2 == 0)
	{
		for (int i = a / 2; i < L.length; i++)
		{
			int x = 1;
			if (L.base[i] == L.base[i - x])
			{
				x = x + 2;
				if (i = L.length - 1)
				{
					cout << "�Գ�" << endl;
					return 1;
				}
			}
			else
			{
				cout << "���Գ�" << endl;
				return 0;
				break;
			}
		}
	}
	else
	{
		for (int i = a / 2; i < L.length; i++)
		{
			int x = 1;
			if (L.base[i + x] == L.base[i - x])
			{
				x = x + 2;
				if (i = L.length - 1)
				{
					cout << "�Գ�" << endl;
					return 1;
				}
			}
			else
			{
				cout << "���Գ�" << endl;
				return 0;
				break;
			}
		}
	}
}
//5.ʵ�ְѸñ���������������ż��֮ǰ,�����ǰ��Ϊ����,����Ϊż����
void sortlist(Sqlist& L)
{
	int odd[10];  //��¼����
	int even[10]; //��¼ż��
	int o = 0;
	int e = 0;
	for (int i = 0; i < L.length; i++)
	{
		if (L.base[i] % 2 == 0)
		{
			even[e] = L.base[i];
			e++;
		}
		else
		{
			odd[o] = L.base[i];
			o++;
		}
	}
	for (int i = 0; i < o; i++)
	{
		L.base[i] = odd[i];
	}
	int j = 0;
	for (int i = o; i < L.length; i++)
	{
		L.base[i] = even[j];
		j++;
	}
	cout << "������ǰ��ż���ں�" << endl;
	for (int i = 0; i < L.length; i++)
	{
		cout << L.base[i] << "   ";
	}
	cout << endl;
}
//6.��������Ԫ�������������������㷨����һ�������
void orderlist(Sqlist& L)
{
	//ð������
	for (int i = 0; i < L.length; i++)
	{
		for (int j = L.length; j > 1; j--)
		{
			if (L.base[j - 1] > L.base[j - 2])
				continue;
			else
			{
				int b, c;
				b = L.base[j - 1]; c = L.base[j - 2];
				L.base[j - 1] = c; L.base[j - 2] = b;
			}
		}
	}
	cout << "�����" << endl;
	for (int i = 0; i < L.length; i++)
	{
		cout << L.base[i] << "   ";
	}
	cout << endl;
}
//7.�����㷨6���������ǵݼ�����������Ǻϲ���һ���ǵݼ������
void margelist(Sqlist& L1, Sqlist& L2, Sqlist& L3)
{
	orderlist(L1);
	orderlist(L2);
	int a = 0;
	for (int i = 0; i < L1.length; i++)
	{
		L3.base[a] = L1.base[i];
		a++;
	}
	for (int i = 0; i < L2.length; i++)
	{
		L3.base[a] = L2.base[i];
		a++;
	}
	orderlist(L3);
}
int main()
{
	Sqlist La, Lb, Lc;
	initList(La);
	traversalList(La);
	locateList(La, 1);
	symmetry(La);
	sortlist(La);
	orderlist(La);


	initList(Lb);
	initList(Lc);
	margelist(La, Lb, Lc);
	return 0;
}