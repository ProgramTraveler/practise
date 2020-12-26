#include<iostream>
#include<string.h>
#include<vector>

using namespace std;

int a[100];
int tem[100];
vector<int>v[100];
void hash1(int p, int n)///线性探测法
{
	memset(tem, 0, sizeof(tem));
	for (int i = 0; i < n; i++)
	{
		int tt = a[i] % p;
		if (!tem[tt])
			tem[tt] = a[i];
		else
		{
			for (int j = 1; j <= n; j++)
				if (!tem[(tt + j) % n])
				{
					tem[(tt + j) % n] = a[i];
					break;
				}
		}
	}
}
void hash2(int p, int n)///外拉链法
{
	for (int i = 0; i < n; i++)
		v[a[i] % p].push_back(a[i]);
}

int main() 
{
	int n;
	cout << "请输入有序数的个数" << endl;
	cin >> n;
	cout << "请输入" << n << "个有序的数" << endl;
	for (int i = 0; i < n; i++)
		cin >> a[i];


	cout << "现在建立散列函数为H(key)=key%p，请输入p" << endl;
	int p;
	cin >> p;
	hash1(p, n);
	cout << "线性探测法存储" << n << "个数的对应位置为" << endl;
	for (int i = 0; i < n; i++)
		cout << tem[i] << ' ';
	cout << endl;
	hash2(p, n);
	cout << "外拉链法存储" << n << "个数的对应状态为" << endl;
	cout << "余数" << endl;
	for (int i = 0; i < p; i++)
	{
		int l = v[i].size();
		cout << " " << i << "  | ";
		for (int j = 0; j < l; j++)
			cout << v[i][j] << ' ';
		cout << endl;
	}
	cout << endl;
	return 0;


	return 0;
}