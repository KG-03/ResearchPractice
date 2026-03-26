#include <iostream>
using namespace std;

int main() {
    int sides[3];

    cin >> sides[0] >> sides[1] >> sides[2];

    int max = 0;
    int sum = 0;
    
    for(int i = 0; i <= 2; i++) {
        if(max < sides[i]) max = sides[i];
        sum += sides[i];
    }
    sum -= max;

    if(max >= sum) cout << sum + sum - 1 << endl;
    else cout << sum + max << endl;
    
    return 0;
}