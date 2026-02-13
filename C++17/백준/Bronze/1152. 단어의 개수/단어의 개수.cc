#include <iostream>
#include <string>

using namespace std;

int main() {
    string S;
    int word = 1;

    getline(cin, S);

    if(S.length() == 1 && S[0] == ' ') {
        cout << "0" << endl;
        return 0;
    }

    for(int i = 1; i < S.length() - 1; i++) {
        if(S[i] == ' ') word++;
    }

    cout << word << endl;
    
    return 0;
}