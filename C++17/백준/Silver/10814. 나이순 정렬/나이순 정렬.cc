#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct Member {
    int age;
    string name;
};

bool compare(Member m1, Member m2) {
    return m1.age < m2.age;
}

int main() {
    int n = 0;
    cin >> n;

    vector<Member> vec;
    int age = 0;
    string name;
    for(int i = 0; i < n; i++) {
        cin >> age;
        cin >> name;
        vec.emplace_back(Member{age, name});
    }
    
    stable_sort(vec.begin(), vec.end(), compare);

    for (int i = 0; i < n; i++) {
        cout << vec[i].age << " " << vec[i].name << endl;
    }
    
    return 0;
}