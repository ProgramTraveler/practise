#include<iostream>
#include<string.h>
#include<vector>

using namespace std;

int a[100];
int tem[100];
vector<int>v[100];
void hash1(int p, int n)///����̽�ⷨ
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
void hash2(int p, int n)///��������
{
	for (int i = 0; i < n; i++)
		v[a[i] % p].push_back(a[i]);
}

int main() 
{
	int n;
	cout << "�������������ĸ���" << endl;
	cin >> n;
	cout << "������" << n << "���������" << endl;
	for (int i = 0; i < n; i++)
		cin >> a[i];


	cout << "���ڽ���ɢ�к���ΪH(key)=key%p��������p" << endl;
	int p;
	cin >> p;
	hash1(p, n);
	cout << "����̽�ⷨ�洢" << n << "�����Ķ�Ӧλ��Ϊ" << endl;
	for (int i = 0; i < n; i++)
		cout << tem[i] << ' ';
	cout << endl;
	hash2(p, n);
	cout << "���������洢" << n << "�����Ķ�Ӧ״̬Ϊ" << endl;
	cout << "����" << endl;
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