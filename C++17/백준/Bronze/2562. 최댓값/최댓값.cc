#include <iostream>
using namespace std;

int main() {
    int array[9];

    int max = 0;
    int maxIndex = 0;

    for (int i = 0; i < sizeof(array)/sizeof(int); i++) {
        cin >> array[i];
        
        if (max < array[i]) {
            max = array[i];
            maxIndex = i;
        }
        
    }

    cout << max << endl;
    cout << maxIndex + 1 << endl;
}