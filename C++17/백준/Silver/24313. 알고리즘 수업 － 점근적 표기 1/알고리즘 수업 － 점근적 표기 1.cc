#include <iostream>
using namespace std;

int main() {
    int a1 = 0;
    int a0 = 0;
    int c = 0;
    int n = 0;

    cin >> a1 >> a0;
    cin >> c;
    cin >> n;

    while(1) {
        if (a1 * n + a0 > c * n) {
            cout << 0 << endl;
            break;
        }
        
        if (n >= 100) {
            cout << 1 << endl;
            break;
        }

        n++;
    }
    
    return 0;
}