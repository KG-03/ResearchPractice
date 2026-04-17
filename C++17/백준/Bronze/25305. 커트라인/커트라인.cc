#include <iostream>
using namespace std;

int main() {
    int n = 0;
    int k = 0;
    cin >> n >> k;

    int scores[n];

    for(int i = 0; i < n; i++) {
        cin >> scores[i];
    }

    int tmp = 0;

    for(int i = 0; i < n; i++) {
        for(int j = i+1; j < n; j++) {
            if(scores[i] > scores[j]) {
                tmp = scores[j];
                scores[j] = scores[i];
                scores[i] = tmp;
            }
        }
    }
    
    cout << scores[n-k] << endl;
    
    return 0;
}