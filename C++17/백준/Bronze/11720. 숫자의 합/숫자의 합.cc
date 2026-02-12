#include <iostream>
using namespace std;

int main() {
    int N = 0;
    string s;

    cin >> N >> s;

    int sum = 0;
    
    for(int i = 0; i < N; i++){
        sum += s[i] - '0';
    }

    cout << sum << endl;
        
    return 0;
}