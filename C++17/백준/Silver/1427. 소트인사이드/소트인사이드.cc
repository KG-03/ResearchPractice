#include <iostream>
using namespace std;

int main() {
    int n = 0;
    cin >> n;

    int array[10] = {0};
    int tmp = n;
    int ten = 0;
    
    while(1) {
        array[ten] = tmp % 10;
        tmp /= 10;
        ten++;

        if (tmp == 0) break;
    }
    
    for (int i = 0; i < ten; i++) {
        for (int j = i; j < ten; j++) {
            if(array[i] < array[j]) {
                tmp = array[j];
                array[j] = array[i];
                array[i] = tmp;
            }
        }
    }

    for (int i = 0; i < ten; i++) {
        cout << array[i];
    }
    
    return 0;
}