#include <iostream>
using namespace std;

int main() {
    int a = 0;
    int b = 0;
    
    while(1) {
        cin >> a >> b;

        if(a == 0 && b == 0) break;

        if(a > b && a % b == 0) {
            cout << "multiple" << endl;
        }
        else if (a < b && b % a ==0) {
            cout << "factor" << endl;
        }
        else {
            cout << "neither" << endl;
        }
        
    }

    return 0;
}