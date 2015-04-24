var should = require('chai').should();
var Txoutmap = require('../lib/txoutmap');
var Tx = require('../lib/tx');
var Txout = require('../lib/txout');
var Script = require('../lib/script');
var BN = require('../lib/bn');

describe('Txoutmap', function() {
  var txhashbuf = new Buffer(32);
  txhashbuf.fill(0);
  var label = txhashbuf.toString('hex') + ':' + '0';
  var txout = Txout(BN(0), Script('OP_RETURN'));
  var map = {};
  map[label] = txout;
  var tx = Tx().fromHex('0100000001795b88d47a74e3be0948fc9d1b4737f96097474d57151afa6f77c787961e47cc120000006a47304402202289f9e1ae2ed981cd0bf62f822f6ae4aea40c65c7339d90643cea90de93ad1502205c8a08b3265f9ba7e99057d030d5b91c889a1b99f94a3a5b79d7daaada2409b6012103798b51f980e7a3690af6b43ce3467db75bede190385702c4d9d48c0a735ff4a9ffffffff01c0a83200000000001976a91447b8e62e008f82d95d1f565055a8243cc243d32388ac00000000');

  it('should make a new txoutmap', function() {
    var txoutmap = new Txoutmap();
    txoutmap = Txoutmap();
    txoutmap = Txoutmap(map);
    should.exist(txoutmap);
    should.exist(txoutmap.map);
  });

  describe('#set', function() {

    it('should set a map', function() {
      var txoutmap = Txoutmap().set({map: map});
      txoutmap.map[label].toHex().should.equal(txout.toHex());
    });

    it('should not set prototype items of a map', function() {
      var map2 = Object.create({'fake': true});
      map2[label] = map[label];
      should.exist(map2.fake);
      var txoutmap = Txoutmap().set({map: map2});
      should.not.exist(txoutmap.map.fake);
    });

  });

  describe('#add', function() {
    
    it('should add a txout to the txoutmap', function() {
      var txoutmap = Txoutmap().add(txhashbuf, 0, txout);
      should.exist(txoutmap.map[label]);
    });

  });

  describe('#get', function() {

    it('should get a txout', function() {
      var txoutmap = Txoutmap().set({map: map});
      txoutmap.get(txhashbuf, 0).toHex().should.equal(txout.toHex());
    });

  });

  describe('#addTx', function() {

    it('should add all outputs from a tx', function() {
      var txoutmap = Txoutmap().addTx(tx);
      var txhashbuf = tx.hash();
      var txout = tx.txouts[0];
      txoutmap.get(txhashbuf, 0).toHex().should.equal(txout.toHex());
    });

  });

});
