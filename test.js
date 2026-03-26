const test = require('ava');
const shortener = require('./');

const TEST_URLS = [
    'google.com',
    'https://example.com',
    'https://test.com/path/to/something',
    'https://special-chars.com/!@#$%^&*()',
    'localhost:3000',
    'very.very.long.domain.with.subdomain.example.com',
    'http://user:pass@domain.com',
    'https://domain.com/?query=123&param=456'
];

// Snapshot: hardcoded expected outputs to guarantee backward compatibility
const SNAPSHOTS = {
    'https://google.com': 'Qhq1TQ2n'
};

// ===== gen() basic tests =====

test('gen: output length and format', t => {
    for (const url of TEST_URLS) {
        const shortened = shortener.gen(url);
        t.is(shortened.length, 8, `Short URL length should be 8 for ${url}`);
        t.regex(shortened, /^[0-9A-Za-z]+$/, `Output should be alphanumeric for ${url}`);
    }
});

test('gen: consistency (same input → same output)', t => {
    for (const url of TEST_URLS) {
        const first = shortener.gen(url);
        const second = shortener.gen(url);
        t.is(first, second, `Same URL should generate same code: ${url}`);
    }
});

test('gen: uniqueness', t => {
    const results = new Set();
    for (const url of TEST_URLS) {
        const shortened = shortener.gen(url);
        t.false(results.has(shortened), `Generated code should be unique: ${shortened} for ${url}`);
        results.add(shortened);
    }
});

test('gen: snapshot — backward compatibility', t => {
    for (const [input, expected] of Object.entries(SNAPSHOTS)) {
        t.is(shortener.gen(input), expected, `Snapshot mismatch for ${input}`);
    }
});

// ===== gen() error cases =====

test('gen: missing arguments', t => {
    t.throws(() => shortener.gen(), {
        instanceOf: TypeError,
        message: 'Wrong number of arguments'
    });
});

test('gen: empty string', t => {
    t.throws(() => shortener.gen(''), {
        instanceOf: TypeError,
        message: 'Invalid URL'
    });
});

test('gen: non-string input', t => {
    t.throws(() => shortener.gen(123), { instanceOf: TypeError });
    t.throws(() => shortener.gen(null), { instanceOf: TypeError });
    t.throws(() => shortener.gen(undefined), { instanceOf: TypeError });
    t.throws(() => shortener.gen({}), { instanceOf: TypeError });
    t.throws(() => shortener.gen(true), { instanceOf: TypeError });
    t.throws(() => shortener.gen([]), { instanceOf: TypeError });
});

test('gen: input exceeding max size', t => {
    const huge = 'x'.repeat(65537);
    t.throws(() => shortener.gen(huge), {
        instanceOf: RangeError
    });
});

// ===== gen() edge cases =====

test('gen: unicode input', t => {
    const unicodeInputs = [
        '🎉🎊🎈',
        '你好世界',
        'مرحبا بالعالم',
        'こんにちは',
        'Héllo Wörld',
        '\u0000\u0001\u0002'
    ];
    for (const input of unicodeInputs) {
        const result = shortener.gen(input);
        t.is(result.length, 8, `Should produce 8-char code for Unicode: ${input}`);
        t.regex(result, /^[0-9A-Za-z]+$/);
    }
});

test('gen: large input within limits', t => {
    const large = 'a'.repeat(65536);
    const result = shortener.gen(large);
    t.is(result.length, 8);
    t.regex(result, /^[0-9A-Za-z]+$/);
});

// ===== gen() with custom length =====

test('gen: custom length', t => {
    const input = 'https://google.com';
    const len6 = shortener.gen(input, 6);
    t.is(len6.length, 6);
    t.regex(len6, /^[0-9A-Za-z]+$/);

    const len12 = shortener.gen(input, 12);
    t.is(len12.length, 12);
    t.regex(len12, /^[0-9A-Za-z]+$/);

    const len1 = shortener.gen(input, 1);
    t.is(len1.length, 1);

    const len22 = shortener.gen(input, 22);
    t.is(len22.length, 22);
    t.regex(len22, /^[0-9A-Za-z]+$/);
});

test('gen: default length is 8 when omitted', t => {
    const a = shortener.gen('test');
    const b = shortener.gen('test', 8);
    t.is(a, b);
    t.is(a.length, 8);
});

test('gen: shorter length is prefix of default', t => {
    const full = shortener.gen('https://google.com');
    const short = shortener.gen('https://google.com', 6);
    t.is(short, full.substring(0, 6));
});

test('gen: custom length consistency', t => {
    const input = 'https://example.com/test';
    for (let len = 1; len <= 22; len++) {
        const a = shortener.gen(input, len);
        const b = shortener.gen(input, len);
        t.is(a, b, `Consistency failed for length ${len}`);
        t.is(a.length, len, `Length mismatch for requested ${len}`);
    }
});

test('gen: invalid length', t => {
    t.throws(() => shortener.gen('test', 0), { instanceOf: RangeError });
    t.throws(() => shortener.gen('test', 23), { instanceOf: RangeError });
    t.throws(() => shortener.gen('test', -1), { instanceOf: RangeError });
    t.throws(() => shortener.gen('test', 'abc'), { instanceOf: TypeError });
});

// ===== genAsync() tests =====

test('genAsync: basic usage', async t => {
    const result = await shortener.genAsync('https://google.com');
    t.is(result, 'Qhq1TQ2n');
    t.is(result.length, 8);
});

test('genAsync: matches gen() output', async t => {
    for (const url of TEST_URLS) {
        const sync = shortener.gen(url);
        const async_ = await shortener.genAsync(url);
        t.is(sync, async_, `Async should match sync for ${url}`);
    }
});

test('genAsync: custom length', async t => {
    const result = await shortener.genAsync('https://google.com', 12);
    t.is(result.length, 12);
    t.regex(result, /^[0-9A-Za-z]+$/);
});

test('genAsync: error on invalid input', async t => {
    // These throw synchronously since validation happens before the async work
    t.throws(() => shortener.genAsync(), { instanceOf: TypeError });
    t.throws(() => shortener.genAsync(''), { instanceOf: TypeError });
    t.throws(() => shortener.genAsync(123), { instanceOf: TypeError });
});

test('genAsync: concurrent calls', async t => {
    const promises = TEST_URLS.map(url => shortener.genAsync(url));
    const results = await Promise.all(promises);
    const unique = new Set(results);
    t.is(unique.size, TEST_URLS.length, 'All concurrent results should be unique');
});
