#include <iostream>
using namespace std;

int main() {
    int A = 0;
    int B = 0;

    cin >> A >> B;

    if(A > B)
    {
        cout << ">" << endl;
    }
    else if(B > A)
    {
        cout << "<" << endl;
    }
    else
    {
        cout << "==" << endl;
    }

    return 0;
}