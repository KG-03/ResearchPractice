#include <iostream>
using namespace std;

int main() {
    int n = 0;
    cin >> n;

    int line = 2;
    int dot = 0;

    for (int i = 0; i < n; i++) {
        line = 2 * line - 1;
        dot = line * line;
    }

    cout << dot << endl;
    
    return 0;
}