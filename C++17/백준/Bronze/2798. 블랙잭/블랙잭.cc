#include <iostream>
using namespace std;

int main() {
    int n = 0;
    int m = 0;
    cin >> n >> m;

    int card[n];

    for(int i = 0; i < n; i++) {
        cin >> card[i];
    }

    int sum = card[0] + card[1];
    
    for (int i = 0; i < n; i++) {
        for(int j = i+1; j < n; j++) {
            for (int k = j+1; k < n; k++) {
                if (sum < card[i] + card[j] + card[k] &&
                    card[i] + card[j] + card[k] <= m) {
                    sum = card[i] + card[j] + card[k];
                }
            }
        }
    }

    cout << sum << endl;
    
    return 0;
}