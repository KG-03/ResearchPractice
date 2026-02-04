#include <iostream>
using namespace std;

int main() {
    int T = 0;
    cin >> T;

    for(int i = 1; i <= T; i++) {
        int a = 0;
        int b = 0;

        cin >> a >> b;
        
        cout << "Case #" << i << ": " << a << " + " << b << " = " << a+b << endl;
    }
    
    return 0;
}