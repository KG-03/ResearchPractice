#include <iostream>
#include <cstring>
using namespace std;

int main() {
    char S[101];
    int alphabet[26];

    for(int i = 0; i < 26; i++) {
        alphabet[i] = -1;
    }

    cin >> S;

    for(int i = 0; i < strlen(S); i++) {
        int n = S[i] - 'a';

        if(alphabet[n] == -1) {
            alphabet[n] = i;
        }
    }

    for (int i = 0; i < 26; i++) {
        cout << alphabet[i] << " ";
    }
    
    return 0;
}