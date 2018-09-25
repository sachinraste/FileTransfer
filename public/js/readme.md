# The Issue
There is an issue with sftp.js (client-side) which incorrectly handles Int64 ie. The file size returned in bytes by the server is sometimes shown in negative when it exceeds the limit


The modifications done are as follows : also visit Line no 2571

```
var Int64 = function(a1, offset) {
  offset= offset || 0;
  if (typeof Buffer !== 'undefined' && a1 instanceof Buffer) {
    this.storage= new Array(8);
    this.storage[0]= a1[0+offset];
    this.storage[1]= a1[1+offset];
    this.storage[2]= a1[2+offset];
    this.storage[3]= a1[3+offset];
    this.storage[4]= a1[4+offset];
    this.storage[5]= a1[5+offset];
    this.storage[6]= a1[6+offset];
    this.storage[7]= a1[7+offset];
  } else if (a1 instanceof Array) {
    this.storage = a1.slice(offset,8);
  } else {
    this.storage = this.storage || new Array(8);
    this.setValue.apply(this, arguments);
  }
};
Int64.MAX_INT = Math.pow(2, 53);

Int64.prototype = {
  toNumber: function(allowImprecise) {
    var b = this.storage, o = 0;
    // Running sum of octets, doing a 2's complement
    var negate = b[0] & 0x80, x = 0, carry = 1;
    for (var i = 7, m = 1; i >= 0; i--, m *= 256) {
      var v = b[o+i];

      // 2's complement for negative numbers
      if (negate) {
        v = (v ^ 0xff) + carry;
        carry = v >> 8;
        v = v & 0xff;
      }

      x += v * m;
    }
    // Return Infinity if we've lost integer precision
    if (!allowImprecise && x >= Int64.MAX_INT) {
      return negate ? -Infinity : Infinity;
    }

    return negate ? -x : x;
  }
};
```
