#include <iostream>
using namespace std;

int main() {
    int cp = 0;
    cin >> cp;

    int dp[100][100] = {0,};

    int x = 0;
    int y = 0;
    for(int i =0; i < cp; i++) {
        cin >> x >> y;

        for(int j = x; j < x+10; j++) {
            for (int k = y; k < y+10; k++) {
                dp[j][k] = 1;
            }
        }
    }

    int size = 0;

    for (int i = 0; i < 100; i++) {
        for(int j = 0; j < 100; j++) {
            size += dp[i][j];
        }
    }

    cout << size << endl;
    
    return 0;
}