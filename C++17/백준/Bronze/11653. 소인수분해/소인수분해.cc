#include <iostream>
using namespace std;

int main() {
    int n = 0;
    cin >> n;
    
    int arr[n];
    int ptr = 0;
    
    for(int i = 1; i <= n; i++) {
        if(n % i == 0) {
            arr[ptr] = i;
            ptr++;
        }
    }

    int count = 0;
    int pf = n;
    
    for(int i = 0; i < ptr; i++) {
        
        for(int j = 1; j <= arr[i]; j++) {
            if(arr[i] % j == 0) {
                count++;
            }
        }
        
        if(count == 2) {
            while(pf % arr[i] == 0) {
                pf /= arr[i];
                cout << arr[i] << endl;
            }
        }
        count = 0;
    }
    
    return 0;
}