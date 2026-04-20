#include <iostream>
#include <algorithm>
using namespace std;

int main() {
    long long n;
    cin >> n;

    long long array[n] = {0,};

    for(int i = 0; i < n; i++) {
        cin >> array[i];
    }

    sort(array, array+n);

    for (int i = 0; i < n; i++) {
        cout << array[i] << "\n";
    }
    
    return 0;
}