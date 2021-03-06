const request = require('supertest');
const url = require('../../server/helpers/get-url');
const mongoClient = require('../../server/helpers/mongodb');

describe('server', () => {
  let server;

  beforeEach(function () {
    mongoClient.connect(url, (err, db)=> {
      const collection = db.collection('hello');
      collection.insert([{hello: "world"}], (err, result)=> {
      });
      db.close();
    });
    server = require('../../server');
  });

  afterEach(function () {
    mongoClient.connect(url, (err, db)=> {
      const collection = db.collection('hello');
      collection.removeMany({});
      db.close();
    })
  });

  it('responds to /hello', function testSlash() {
    request(server)
      .get('/hello')
      .expect(200, '"world"');

  });

  it('404 everything else', function testPath(done) {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
});
