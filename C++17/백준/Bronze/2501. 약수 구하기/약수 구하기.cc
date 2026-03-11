#include <iostream>
using namespace std;

int main() {
    int n = 0;
    int k = 0;
    cin >> n >> k;

    int count = 0;
    bool check = false;
    
    for(int i = 1; i <= n; i++) {
        if(n % i == 0) count++;

        if(count == k) {
            check = true;
            cout << i << endl;
            break;
        }
    }

    if(!check) {
        cout << 0 <<endl;
    }
    
    return 0;
}