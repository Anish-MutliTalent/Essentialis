import hashlib
import struct
import base64

def _to_bytes(s): return s if isinstance(s, (bytes, bytearray)) else str(s).encode('utf-8')
def _to_str(b):  return b.decode('utf-8', errors='strict')

def _len_prefix(data: bytes) -> bytes:
    return struct.pack(">I", len(data)) + data

def _len_unprefix(buf: bytes) -> bytes:
    if len(buf) < 4: raise ValueError("bad length prefix")
    L = struct.unpack(">I", buf[:4])[0]
    out = buf[4:4+L]
    if len(out) != L: raise ValueError("truncated payload")
    return out

def _kdf_stream(seed: bytes, n: int) -> bytes:
    # Deterministic stream: H(seed||ctr) concatenated until n bytes
    out = bytearray()
    ctr = 0
    while len(out) < n:
        out.extend(hashlib.sha256(seed + struct.pack(">I", ctr)).digest())
        ctr += 1
    return bytes(out[:n])

def _xor(a: bytes, b: bytes) -> bytes:
    return bytes(x ^ y for x, y in zip(a, b))

def _hash8(m: bytes) -> bytes:
    return hashlib.sha256(m).digest()[:8]

def reversible_product(x: str, y: str) -> str:
    bx, by = _to_bytes(x), _to_bytes(y)
    X = _len_prefix(bx)  # encode lengths to make parsing unambiguous
    Y = _len_prefix(by)

    hx8 = _hash8(X)
    hy8 = _hash8(Y)

    c1_payload = _xor(X, _kdf_stream(hy8, len(X)))  # uses tag of peer
    c2_payload = _xor(Y, _kdf_stream(hx8, len(Y)))

    # capsules are (tag(8 bytes), payload_len(4 bytes), payload)
    cap1 = hy8 + struct.pack(">I", len(c1_payload)) + c1_payload
    cap2 = hx8 + struct.pack(">I", len(c2_payload)) + c2_payload

    # order-insensitive: sort by tag bytes
    a, b = sorted([cap1, cap2])
    blob = a + b
    return base64.urlsafe_b64encode(blob).decode('ascii')

def reversible_divide(product_b64: str, known: str) -> str:
    blob = base64.urlsafe_b64decode(product_b64.encode('ascii'))

    # parse two capsules
    def parse_cap(off):
        tag = blob[off:off+8]
        L = struct.unpack(">I", blob[off+8:off+12])[0]
        payload = blob[off+12:off+12+L]
        return tag, payload, off+12+L

    tag1, pay1, p = parse_cap(0)
    tag2, pay2, _ = parse_cap(p)

    bknown = _to_bytes(known)
    K = _len_prefix(bknown)
    t8 = _hash8(K)  # tag that should match the capsule keyed by 'known'

    # pick matching capsule: the one whose tag == t8 is the one that encodes the OTHER operand
    if tag1 == t8:
        other_enc = _xor(pay1, _kdf_stream(t8, len(pay1)))
    elif tag2 == t8:
        other_enc = _xor(pay2, _kdf_stream(t8, len(pay2)))
    else:
        raise ValueError("known operand does not match product")

    other = _len_unprefix(other_enc)
    return _to_str(other)

# ---- infix sugar, matching your prior API ----
class Infix:
    def __init__(self, fn): self.fn = fn
    def __ror__(self, other): return Infix(lambda x, self=self, other=other: self.fn(other, x))
    def __or__(self, other):  return self.fn(other)
    def __call__(self, a, b): return self.fn(a, b)

mul = Infix(lambda x, y: reversible_product(x, y))
div = Infix(lambda product, known: reversible_divide(product, known))

# # quick checks:
for i in range(1):
    a = "a"*100000000 + f"{i}"
    b = "b"*100000000 + f"{i}"
    p = a |mul| b
    print(len(p), p[:50], "...")
    p = b | mul | a
    print(len(p), p[:50], "...")

