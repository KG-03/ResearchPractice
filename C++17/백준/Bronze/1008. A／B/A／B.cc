#include <iostream>
using namespace std;

int main()
{
    double a = 0;
    double b = 0;
    
    cin >> a;
    cin >> b;
    
    cout.precision(12);
    cout << fixed;
    cout << a/b << endl;
    
    return 0;
}