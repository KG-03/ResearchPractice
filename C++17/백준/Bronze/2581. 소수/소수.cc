#include <iostream>
using namespace std;

int main() {
    int m = 0;
    int n = 0;

    cin >> m;
    cin >> n;

    int count = 0;
    int sum = 0;
    int min = n;

    for(int i = m; i <= n; i++) {
        for(int j = 1; j <= i; j++) {
            if(i % j == 0) count++;
        }
        
        if(count == 2) {
            if(min > i) min = i;
            sum += i;
        }

        count = 0;
    }

    if(sum > 0) {
        cout << sum << endl;
        cout << min << endl;
    }
    else {
        cout << -1 << endl;
    }
    
    return 0;
}