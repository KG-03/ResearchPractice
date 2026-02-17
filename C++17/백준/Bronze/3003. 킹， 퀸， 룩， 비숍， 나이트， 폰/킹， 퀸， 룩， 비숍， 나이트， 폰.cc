#include <iostream>
using namespace std;

int main() {
    int king = 0;
    int queen = 0;
    int rook = 0;
    int bishop = 0;
    int knight = 0;
    int pawn = 0;

    cin >> king >> queen >> rook >> bishop >> knight >> pawn;

    king = 1 - king;
    queen = 1 - queen;
    rook = 2 - rook;
    bishop = 2 - bishop;
    knight = 2 - knight;
    pawn = 8 - pawn;

    cout << king << " " << queen << " " << rook << " " <<
        bishop << " " << knight << " " << pawn << endl;
    
    return 0;
}