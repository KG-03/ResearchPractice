#include <iostream>
using namespace std;

int main() {
    int n = 0;
    cin >> n;
    
    int bag = 0;
    bool done = 0;

    while (n >= 0) {
        if (n % 5 == 0) {
            bag += n/5;
            done = 1;
            break;
        }
        n -= 3;
        bag++;
    }

    if (!done) cout << -1 << endl;
    else cout << bag << endl;
    
    return 0;
}