#include <iostream>
using namespace std;

int main() {
    int score = 0;

    cin >> score;

    if(score <= 100 && score >= 0)
    {
        if(score >= 90)
        {
            cout << "A" << endl;
        }
        else if(score >= 80)
        {
            cout << "B" << endl;
        }
        else if(score >= 70)
        {
            cout << "C" << endl;
        }
        else if (score >= 60)
        {
            cout << "D" << endl;
        }
        else if (score >= 0)
        {
            cout << "F" << endl;
        }
    }
    else 
    {
        cout << "error" << endl;
    }

    return 0;
}