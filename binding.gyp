{
  "targets": [{
    "target_name": "shortener",
    "sources": [ "shortener.cpp" ],
    "include_dirs": [
      "<!(node -e \"require('nan')\")"
    ],
    "conditions": [
      ["OS=='win'", {
        "libraries": [ "libeay32.lib" ],
        "include_dirs": [ "$(OPENSSL_ROOT)/include" ],
        "library_dirs": [ "$(OPENSSL_ROOT)/lib" ]
      }],
      ["OS=='linux'", {
        "libraries": [ "-lcrypto" ],
        "cflags": [ "-fexceptions" ],
        "cflags_cc": [ "-fexceptions" ]
      }],
      ["OS=='mac'", {
        "libraries": [ "-L/opt/homebrew/opt/openssl/lib", "-lcrypto" ],
        "include_dirs": [ "/opt/homebrew/opt/openssl/include" ],
        "xcode_settings": {
          "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
          "MACOSX_DEPLOYMENT_TARGET": "11.0",
          "OTHER_CFLAGS": [ "-arch x86_64", "-arch arm64" ]
        }
      }]
    ]
  }]
}
