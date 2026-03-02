#include <iostream>
using namespace std;

int main() {
    int n = 0;
    int b = 0;
    
    cin >> n >> b;

    int remainder = -1;
    int quotient = n;

    string base_n;
    char c;

    while (quotient != 0) {
        remainder = quotient % b;
        
        if(remainder > 9) {
            c = remainder + 65 - 10;
            base_n = c + base_n;
        }
        else {
            c = remainder + 48;
            base_n = c + base_n;
        }
        
        quotient = quotient / b;
    }

    cout << base_n << endl;
    
    return 0;
}