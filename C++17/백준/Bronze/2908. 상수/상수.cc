#include <iostream>
using namespace std;

int main() {
    string A;
    string B;

    cin >> A >> B;

    int numA = 100 * (A[2] - 48) + 10 * (A[1] - 48) + (A[0] - 48);
    int numB = 100 * (B[2] - 48) + 10 * (B[1] - 48) + (B[0] - 48);
    int max = numA;

    if(max < numB) {
        max = numB;
    }

    cout << max;    
    
    return 0;
}