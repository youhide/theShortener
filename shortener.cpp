// shortener.cpp
#include <cmath>
#include <nan.h>
#include <iostream>

using namespace std;

// Function to generate a short url from intger ID
string idToShortURL(long int n)
{
    // Map to store 62 possible characters
    char map[] = "abcdefghijklmnopqrstuvwxyzABCDEF"
            "GHIJKLMNOPQRSTUVWXYZ0123456789";

    string shorturl;

    // Convert given integer id to a base 62 number
    while (n)
    {
        // use above map to store actual character
        // in short url
        shorturl.push_back(map[n%62]);
        n = n/62;
    }

    // Reverse shortURL to complete base conversion
    reverse(shorturl.begin(), shorturl.end());

    return shorturl;
}

// Function to get integer ID back from a short url
long int shortURLtoID(string URL)
{
    long int id = 0; // initialize result

    // A simple base conversion logic
    for (int i=0; i < URL.length(); i++)
    {
        if ('a' <= URL[i] && URL[i] <= 'z')
            id = id*62 + URL[i] - 'a';
        if ('A' <= URL[i] && URL[i] <= 'Z')
            id = id*62 + URL[i] - 'A' + 26;
        if ('0' <= URL[i] && URL[i] <= '9')
            id = id*62 + URL[i] - '0' + 52;
    }
    return id;
}

void Shortener(const Nan::FunctionCallbackInfo<v8::Value>& info) {

    if (info.Length() != 1 ) {
        Nan::ThrowTypeError("Wrong number of arguments");
        return;
    }

    v8::String::Utf8Value param1(info[0]->ToString());

    string foo = string(*param1);

    int theID = shortURLtoID(foo);
    string shortURL = idToShortURL(theID);

    info.GetReturnValue().Set(Nan::New<v8::String>(shortURL).ToLocalChecked());

}

void Init(v8::Local<v8::Object> exports) {
    exports->Set(Nan::New("id").ToLocalChecked(),
                 Nan::New<v8::FunctionTemplate>(Shortener)->GetFunction());
}

NODE_MODULE(shortener, Init)
