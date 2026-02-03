#include <iostream>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(NULL);

    int T = 0;
    cin >> T;

    for(int i = 0; i < T; i++) {
        int a = 0;
        int b = 0;
        cin >> a >> b;

        cout << a+b << "\n";
    }
    
    return 0;
}