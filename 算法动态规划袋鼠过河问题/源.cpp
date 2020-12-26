#include<iostream>
#include<algorithm>
#include<vector>
using namespace std;

int main() 
{
	int n;
	cin >> n;
	vector<int> vec(n, 0);
	vector<int> dp(n, 10000);
	int hops = -1;
	dp[0] = 0;
	//�����п��ܵ�ѡ��������򣬲�ѡ�����ŵ���һ��
	for (int i = 0; i < n; i++)
	{
		cin >> vec[i];
	}
	for (int i = 0; i < n; i++) 
	{
		for (int j = 1; j <= vec[i]; j++) 
		{
			//����ͨ����
			if (i + j < n)
				dp[i + j] = min(dp[i + j], dp[i] + 1);
			//�ܹ��ɹ�����
			else 
			{
				if (hops == -1)
					hops = dp[i] == 10000 ? -1 : dp[i] + 1;
				else
					hops = min(hops, dp[i] + 1);
			}
		}
	}
	cout << hops << endl;

	return 0;
}