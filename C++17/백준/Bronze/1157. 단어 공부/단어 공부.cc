#include <iostream>
using namespace std;

int main() {
    string s;
    cin >> s;

    int alphabet[26] = {0,};
    int most = 0;
    char c;

    for(int i = 0; i < s.length(); i++) {
        s[i] = toupper(s[i]);
    }

    for(int i = 0; i < s.length(); i++) {
        alphabet[(s[i] - 65)]++;
    }

    for(int i = 0; i < sizeof(alphabet)/4; i++) {
        if (most < alphabet[i]) {
            most = alphabet[i];
            c = i + 65;
        }
        else if(most == alphabet[i]) {
            c = '?';
        }
    }

    cout << c << endl;
    
    return 0;
}