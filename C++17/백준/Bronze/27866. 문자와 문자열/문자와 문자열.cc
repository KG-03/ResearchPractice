#include <iostream>
#include <string>
using namespace std;

int main() {
    string S;
    int i;

    cin >> S;
    cin >> i;

    cout << S.substr(i-1,1) << endl;
}