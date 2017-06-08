{
    "targets": [
        {
            "target_name": "shortener",
            "sources": [ "shortener.cpp" ],
            "include_dirs": [
                "<!(node -e \"require('nan')\")"
            ]
        }
    ]
}
