#include <iostream>
using namespace std;

int main() {
    int a = 0;
    int b = 0;

    while (1) {
        cin >> a >> b;
        
        if(cin.eof()) {
            break;
        }
        else {
            cout << a + b << endl;
        }
    }

    return 0;
}