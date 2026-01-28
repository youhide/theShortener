#include <nan.h>
#include <string>
#include <sstream>
#include <algorithm>
#include <cctype>
#include <openssl/evp.h>
#include <iomanip>

const std::string ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const int BASE = ALPHABET.length();

std::string sha256(const std::string &input)
{
    unsigned char hash[EVP_MAX_MD_SIZE];
    unsigned int hashLen;

    EVP_MD_CTX *ctx = EVP_MD_CTX_new();
    EVP_DigestInit_ex(ctx, EVP_sha256(), nullptr);
    EVP_DigestUpdate(ctx, input.c_str(), input.length());
    EVP_DigestFinal_ex(ctx, hash, &hashLen);
    EVP_MD_CTX_free(ctx);

    std::stringstream ss;
    for (unsigned int i = 0; i < hashLen; i++)
    {
        ss << std::hex << std::setw(2) << std::setfill('0') << static_cast<int>(hash[i]);
    }
    return ss.str();
}

std::string encodeBase62(const std::string &hash)
{
    uint64_t num = 0;
    // Take first 16 characters of hash to convert to number
    for (size_t i = 0; i < 16 && i < hash.length(); i++)
    {
        num = (num << 4) + (isdigit(hash[i]) ? hash[i] - '0' : (tolower(hash[i]) - 'a' + 10));
    }

    std::string encoded;
    while (num > 0)
    {
        encoded = ALPHABET[num % BASE] + encoded;
        num /= BASE;
    }

    // Pad to ensure consistent length
    while (encoded.length() < 8)
    {
        encoded = ALPHABET[0] + encoded;
    }

    return encoded.substr(0, 8);
}

void Shortener(const Nan::FunctionCallbackInfo<v8::Value> &info)
{
    if (info.Length() != 1)
    {
        Nan::ThrowTypeError("Wrong number of arguments");
        return;
    }

    v8::Isolate *isolate = info.GetIsolate();
    v8::String::Utf8Value param1(isolate, info[0]->ToString(isolate->GetCurrentContext()).ToLocalChecked());

    if (param1.length() == 0)
    {
        Nan::ThrowTypeError("Invalid URL");
        return;
    }

    std::string input(*param1);
    std::string hashed = sha256(input);
    std::string shortUrl = encodeBase62(hashed);

    info.GetReturnValue().Set(Nan::New<v8::String>(shortUrl).ToLocalChecked());
}

void Init(v8::Local<v8::Object> exports,
          v8::Local<v8::Value> module,
          v8::Local<v8::Context> context,
          void *priv)
{
    exports->Set(context,
                 Nan::New("gen").ToLocalChecked(),
                 Nan::New<v8::FunctionTemplate>(Shortener)->GetFunction(context).ToLocalChecked())
        .Check();
}

NODE_MODULE_CONTEXT_AWARE(shortener, Init)
