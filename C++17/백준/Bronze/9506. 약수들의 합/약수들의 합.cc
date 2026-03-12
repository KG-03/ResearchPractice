#include <iostream>
using namespace std;

int main() {
    int n;

    while (1) {
        cin >> n;
        if (n == -1) break;

        bool divisor[n];
        int pn = 0;
        int last = 0;

        for (int i = 0; i < n; i++) {
            divisor[i] = false;
        }
        
        for(int i = 1; i < n; i++) {
            if(n % i == 0) {
                divisor[i] = true;
                pn += i;
                last = i;
            }
        }

        if(pn == n) {
            cout << n << " = ";
            for (int i = 0; i < n; i++) {
                if(divisor[i] == true && last != i) {
                    cout << i << " + ";
                }
                else if (divisor[i] == true && last == i) {
                    cout << i;
                }
            }
            cout << endl;
        }
        else {
            cout << n << " is NOT perfect." << endl;
        }
    }
    return 0;
}