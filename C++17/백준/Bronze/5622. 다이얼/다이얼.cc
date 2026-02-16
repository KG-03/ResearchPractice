#include <iostream>
#include <string>
#include <cstring>
using namespace std;

int main() {
    string S;
    cin >> S;

    int number[S.length()];
    
    for(int i = 0; i < S.length(); i++){
        number[i] = (S[i] - 65);
    }

    for(int i = 0; i < sizeof(number)/4; i++) {
        if(number[i] > 21) {
            number[i] = 9;
        }
        else if(number [i] > 18) {
            number[i] = 8;
        }
        else if(number [i] > 14) {
            number[i] = 7;
        }
        else if(number [i] > 11) {
            number[i] = 6;
        }
        else if(number [i] > 8) {
            number[i] = 5;
        }
        else if(number [i] > 5) {
            number[i] = 4;
        }
        else if(number [i] > 2) {
            number[i] = 3;
        }
        else if(number [i] >= 0) {
            number[i] = 2;
        }
    }

    int time = 0;
    
    for(int i = 0; i < S.length(); i++) {
        time += 2 + (number[i] - 1);
    }

    cout << time << endl;
    
    return 0;
}