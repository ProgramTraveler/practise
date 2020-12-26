#include <iostream>

using namespace std;

const int N = 20;
int n;
int a[N];

//count函数用于计算一个区间的质量
int count(int begin, int end)
{
	int sum = 0;
	for (int i = begin; i <= end; i++) sum += a[i];
	return sum;
}

//solve函数用来递归解决一个个子问题
void solve(int begin, int end)
{
	int mid = begin + end >> 1;
	if (begin == end)
	{
		cout << a[begin] << endl;
		return;
	}
	if (begin == end - 1)
	{
		if (a[begin] < a[end]) cout << a[begin] << endl;
		else cout << a[end] << endl;
		return;
	}
	if ((begin + end) & 1)
	{
		if (count(begin, mid) < count(mid + 1, end)) solve(begin, mid);
		else solve(mid + 1, end);
	}
	else
	{
		if (count(begin, mid - 1) < count(mid + 1, end)) solve(begin, mid - 1);
		else if (count(begin, mid - 1) > count(mid + 1, end)) solve(mid + 1, end);
		else {
			cout << a[mid] << endl;
			return;
		}
	}
}

int main()
{
	cout << "输入硬币个数（硬币个数不少于三个）" << endl;
	cin >> n;
	cout << "输入每个硬币质量（假币质量一定比真币轻）" << endl;
	for (int i = 0; i < n; i++)
	{
		cin >> a[i];
	}
	cout << endl;
	solve(0, n - 1);
	return 0;
}