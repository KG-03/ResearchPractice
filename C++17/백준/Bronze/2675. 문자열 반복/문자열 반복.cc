#include <iostream>
#include <cstring>
using namespace std;

int main() {
    int T = 0;
    int loop = 0;
    char S[21];

    cin >> T;

    for(int i = 0; i < T; i++) {
        cin >> loop;
        cin >> S;

        for(int j = 0; j < strlen(S); j++) {
            for(int k = 0; k < loop; k++) {
                cout << S[j];                
            }
        }
        cout << endl;
    }
    
    return 0;
}