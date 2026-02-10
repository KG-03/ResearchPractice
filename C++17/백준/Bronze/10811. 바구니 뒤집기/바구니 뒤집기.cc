#include <iostream>
using namespace std;

int main() {
    int n;
    int m;

    cin >> n >> m;
    
    int basket[n];

    for (int a = 0; a < n; a++) {
        basket[a] = a + 1;
    }

    int i;
    int j;

    for(int a = 0; a < m; a++) {
        cin >> i >> j;

        if(j-i > 0) {
            for (int b = 0; b <= (j-i)/2; b++) {
                int tmp = basket[i+b-1];
                basket[i+b-1] = basket[j-b-1];
                basket[j-b-1] = tmp;
            }
        }
    }

    for (int a = 0; a < n; a++) {
        cout << basket[a] << " ";
    }
    
    return 0;
}