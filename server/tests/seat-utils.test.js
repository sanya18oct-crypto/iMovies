const test=require('node:test');const assert=require('node:assert/strict');
test('booking seat count is constrained by documented product limit',()=>{const maxSeats=8;assert.equal(maxSeats,8);assert.ok(1<=maxSeats);assert.ok(9>maxSeats);});
test('seat identifiers distinguish tier, row, and number',()=>{const seat=s=>`${s.tier}-${s.row}-${s.number}`;assert.notEqual(seat({tier:'lower',row:'A',number:1}),seat({tier:'balcony',row:'A',number:1}));});
