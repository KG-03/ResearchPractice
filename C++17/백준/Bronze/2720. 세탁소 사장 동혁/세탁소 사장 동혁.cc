#include <iostream>
using namespace std;

int main() {
    int t = 0;
    cin >> t;

    int money;
    int change[4] = {25, 10, 5, 1};

    for(int i = 0; i < t; i++) {
        cin >> money;
        
        for(int j = 0; j < 4; j++) {
            cout << money / change[j] << " ";
            money %= change[j];
        }
        cout << endl;
    }
    
    return 0;
}