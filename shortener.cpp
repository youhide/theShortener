#include <napi.h>
#include <string>
#include <array>
#include <algorithm>
#include <openssl/evp.h>

static constexpr const char *ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
static constexpr int BASE = 62;
static constexpr int DEFAULT_OUTPUT_LENGTH = 8;
static constexpr int MIN_OUTPUT_LENGTH = 1;
static constexpr int MAX_OUTPUT_LENGTH = 22;
static constexpr size_t MAX_INPUT_SIZE = 65536;
static constexpr size_t SHA256_HASH_SIZE = 32;
static constexpr size_t HASH_PREFIX_BYTES = 8;

// Compute SHA-256 and return raw 32-byte digest
static bool sha256(const std::string &input, std::array<unsigned char, SHA256_HASH_SIZE> &out)
{
    unsigned int hashLen = 0;
    EVP_MD_CTX *ctx = EVP_MD_CTX_new();
    if (!ctx)
        return false;

    if (EVP_DigestInit_ex(ctx, EVP_sha256(), nullptr) != 1 ||
        EVP_DigestUpdate(ctx, input.c_str(), input.length()) != 1 ||
        EVP_DigestFinal_ex(ctx, out.data(), &hashLen) != 1)
    {
        EVP_MD_CTX_free(ctx);
        return false;
    }

    EVP_MD_CTX_free(ctx);
    return true;
}

// Encode raw hash bytes to Base62 string of given length
// Uses first N bytes of hash as big-endian uint64_t
// Mathematically equivalent to the old hex-parsing approach:
//   16 hex chars → (num << 4) per char = 8 bytes → (num << 8) per byte
static std::string encodeBase62(const std::array<unsigned char, SHA256_HASH_SIZE> &hash, int length)
{
    // For length <= 10, 8 bytes (64 bits) of entropy is sufficient
    // For length > 10, use 16 bytes (128 bits) via __uint128_t
    std::string encoded;

    if (length <= 10)
    {
        uint64_t num = 0;
        for (size_t i = 0; i < HASH_PREFIX_BYTES; i++)
        {
            num = (num << 8) | hash[i];
        }

        while (num > 0)
        {
            encoded.push_back(ALPHABET[num % BASE]);
            num /= BASE;
        }
    }
    else
    {
        // Use 16 bytes for longer outputs (up to 22 base62 chars)
        __uint128_t num = 0;
        for (size_t i = 0; i < 16; i++)
        {
            num = (num << 8) | hash[i];
        }

        while (num > 0)
        {
            encoded.push_back(ALPHABET[static_cast<int>(num % BASE)]);
            num /= BASE;
        }
    }

    // Reverse since we built least-significant digit first
    std::reverse(encoded.begin(), encoded.end());

    // Pad front to ensure minimum length
    while (static_cast<int>(encoded.size()) < length)
    {
        encoded.insert(encoded.begin(), ALPHABET[0]);
    }

    // Truncate from the end to the requested length (keep MSB prefix)
    return encoded.substr(0, length);
}

// Parse and validate the optional length argument
static int parseLength(const Napi::CallbackInfo &info)
{
    if (info.Length() >= 2)
    {
        if (!info[1].IsNumber())
        {
            Napi::TypeError::New(info.Env(), "Length must be a number")
                .ThrowAsJavaScriptException();
            return -1;
        }
        int length = info[1].As<Napi::Number>().Int32Value();
        if (length < MIN_OUTPUT_LENGTH || length > MAX_OUTPUT_LENGTH)
        {
            Napi::RangeError::New(info.Env(),
                                  "Length must be between " + std::to_string(MIN_OUTPUT_LENGTH) +
                                      " and " + std::to_string(MAX_OUTPUT_LENGTH))
                .ThrowAsJavaScriptException();
            return -1;
        }
        return length;
    }
    return DEFAULT_OUTPUT_LENGTH;
}

// Validate input string argument and return it
static std::string parseInput(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    if (info.Length() < 1)
    {
        Napi::TypeError::New(env, "Wrong number of arguments")
            .ThrowAsJavaScriptException();
        return "";
    }

    if (!info[0].IsString())
    {
        Napi::TypeError::New(env, "Input must be a string")
            .ThrowAsJavaScriptException();
        return "";
    }

    std::string input = info[0].As<Napi::String>().Utf8Value();

    if (input.empty())
    {
        Napi::TypeError::New(env, "Invalid URL")
            .ThrowAsJavaScriptException();
        return "";
    }

    if (input.size() > MAX_INPUT_SIZE)
    {
        Napi::RangeError::New(env, "Input exceeds maximum size of " +
                                       std::to_string(MAX_INPUT_SIZE) + " bytes")
            .ThrowAsJavaScriptException();
        return "";
    }

    return input;
}

// Synchronous gen(input, length?)
Napi::Value Gen(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    std::string input = parseInput(info);
    if (env.IsExceptionPending())
        return env.Undefined();

    int length = parseLength(info);
    if (env.IsExceptionPending())
        return env.Undefined();

    std::array<unsigned char, SHA256_HASH_SIZE> hash;
    if (!sha256(input, hash))
    {
        Napi::Error::New(env, "SHA-256 computation failed")
            .ThrowAsJavaScriptException();
        return env.Undefined();
    }

    std::string result = encodeBase62(hash, length);
    return Napi::String::New(env, result);
}

// Async worker for genAsync(input, length?)
class ShortenerAsyncWorker : public Napi::AsyncWorker
{
public:
    ShortenerAsyncWorker(Napi::Env env, const std::string &input, int length)
        : Napi::AsyncWorker(env),
          deferred_(Napi::Promise::Deferred::New(env)),
          input_(input),
          length_(length) {}

    Napi::Promise Promise() { return deferred_.Promise(); }

protected:
    void Execute() override
    {
        if (!sha256(input_, hash_))
        {
            SetError("SHA-256 computation failed");
            return;
        }
        result_ = encodeBase62(hash_, length_);
    }

    void OnOK() override
    {
        deferred_.Resolve(Napi::String::New(Env(), result_));
    }

    void OnError(const Napi::Error &error) override
    {
        deferred_.Reject(error.Value());
    }

private:
    Napi::Promise::Deferred deferred_;
    std::string input_;
    int length_;
    std::array<unsigned char, SHA256_HASH_SIZE> hash_;
    std::string result_;
};

// Async genAsync(input, length?)
Napi::Value GenAsync(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    std::string input = parseInput(info);
    if (env.IsExceptionPending())
        return env.Undefined();

    int length = parseLength(info);
    if (env.IsExceptionPending())
        return env.Undefined();

    auto *worker = new ShortenerAsyncWorker(env, input, length);
    Napi::Promise promise = worker->Promise();
    worker->Queue();
    return promise;
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    exports.Set("gen", Napi::Function::New(env, Gen, "gen"));
    exports.Set("genAsync", Napi::Function::New(env, GenAsync, "genAsync"));
    return exports;
}

NODE_API_MODULE(shortener, Init)
