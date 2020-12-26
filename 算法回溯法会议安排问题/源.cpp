#include<iostream>
#include<cstdio>
using namespace std;

#define MAX 20  
int n;
int ans, temp, counter;

struct classroom
{
	int start;
	int end;
};

void dfs(classroom a[], int i)
{
	counter = 0;
	for (int j = 1; j <= n; j++)
	{
		if (a[j].start >= a[i].end)
		{
			int t = (a[j].end - a[j].start);
			temp += t;
			dfs(a, j);
			temp -= t;  //»ØËÝ
			counter++;
		}
	}
	if (counter == 0)
		if (temp > ans)ans = temp;
}

int main()
{
	cin >> n;
	classroom a[MAX];
	a[0].end = 0;
	for (int i = 1; i <= n; i++)
		cin >> a[i].start >> a[i].end;
	dfs(a, 0);
	cout << ans << endl;
	return 0;
}
