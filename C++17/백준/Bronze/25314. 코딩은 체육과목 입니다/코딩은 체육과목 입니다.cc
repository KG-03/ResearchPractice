#include <iostream>
using namespace std;

int main() {
    int N = 0;
    cin >> N;

    string howLong = "int";

    for (int i = 0; i < N/4; i++)
    {
        howLong = "long " + howLong;
    }

    cout << howLong << endl;
    
    return 0;
}