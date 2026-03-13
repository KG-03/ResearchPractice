#include <iostream>
using namespace std;

int main() {
    int n = 0;
    cin >> n;

    int num = 0;
    int pn = 0;
    int count = 0;
    
    for(int i = 0; i < n; i++) {
        cin >> num;

        for (int j = 1; j <= num; j++) {
            if(num % j == 0) {
                count++;
            }
        }

        if(count == 2) pn++;
        
        count = 0;
    }

    cout << pn << endl;
    
    return 0;
}