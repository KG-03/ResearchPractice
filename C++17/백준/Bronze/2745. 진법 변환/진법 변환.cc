#include <iostream>
#include <cctype>
using namespace std;

int main() {
    string n;
    int b = 0;

    cin >> n >> b;

    int trans[n.length()];

    for(int i = 0; i < n.length(); i++) {
        if(isalpha(n[i])) {
            trans[i] = n[i] - 65 + 10;
        }
        else {
            trans[i] = n[i] - 48;
        }
    }
    
    int decimal = 0;
    
    for(int i = 0; i < n.length(); i++) {
        int square = 1;
        
        for(int j = 0; j < i; j++) {
            square *= b;
        }

        decimal += trans[n.length()-1-i] * square;
    }

    cout << decimal << endl;
    
    return 0;
}