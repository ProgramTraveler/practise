#include<iostream>

using namespace std;

#define Listinitsize 50

typedef struct
{
	int* base;       //存储空间基址
	int length;      //当前长度
	int listsize;    //当前存储容量
}Sqlist;

//1.构造线性表
void initList(Sqlist& L)
{
	L.base = (int*)malloc(Listinitsize * sizeof(int));
	if (!L.base)
		exit(0);
	L.listsize = Listinitsize;
	cout << "输入线性表长度" << endl;
	cin >> L.length;
	cout << "输入" << L.length << "个元素" << endl;
	for (int i = 0; i < L.length; i++)
	{
		cin >> L.base[i];
	}
}

//2.实现该顺序表的遍历。
void traversalList(Sqlist& L)
{
	cout << "遍历线性表" << endl;
	for (int i = 0; i < L.length; i++)
	{
		cout << L.base[i] << "  ";
	}
	cout << endl;
}
//3.在该顺序表中进行顺序查找某一元素,查找成功返回1,否则返回0。
int locateList(Sqlist& L, int e)
{
	int i = 0;
	while (i < L.length)
	{
		if (L.base[i] == e)
		{
			cout << "查找元素" << e << "在第" << i + 1 << "位" << endl;
			return 1;
			break;
		}
		else
			i++;
	}

	cout << "查找元素不在表中" << endl;
	return 0;

}
//4.判断该顺序表中元素是否对称,对称返回1,否则返回0。
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
					cout << "对称" << endl;
					return 1;
				}
			}
			else
			{
				cout << "不对称" << endl;
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
					cout << "对称" << endl;
					return 1;
				}
			}
			else
			{
				cout << "不对称" << endl;
				return 0;
				break;
			}
		}
	}
}
//5.实现把该表中所有奇数排在偶数之前,即表的前面为奇数,后面为偶数。
void sortlist(Sqlist& L)
{
	int odd[10];  //记录奇数
	int even[10]; //记录偶数
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
	cout << "奇数在前，偶数在后：" << endl;
	for (int i = 0; i < L.length; i++)
	{
		cout << L.base[i] << "   ";
	}
	cout << endl;
}
//6.输入整型元素序列利用有序表插入算法建立一个有序表。
void orderlist(Sqlist& L)
{
	//冒泡排序
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
	cout << "有序表：" << endl;
	for (int i = 0; i < L.length; i++)
	{
		cout << L.base[i] << "   ";
	}
	cout << endl;
}
//7.利用算法6建立两个非递减有序表并把它们合并成一个非递减有序表。
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