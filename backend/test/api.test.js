const path = require('path');
const request = require('supertest');
const childProcess = require('child_process');
const baseURL = 'http://localhost:4000/api';
jest.setTimeout(60000);

const publicKeyA = '0xc76c905edd6986049259159e169e0fffb5794831';
const publicKeyB = '0x7f64dB7e8a97b06f4e9fdc7781213ab3ac5d7fb3';

let expressApp;
beforeAll(async () => {
  // run npm start and wait until output includes "Kaleido DApp backend listening on port 4000"
  return new Promise((resolve, reject) => {
    console.log(path.resolve(__dirname, '../'))
    expressApp = childProcess.spawn('npm', ['start'], { stdio: 'pipe', cwd: path.resolve(__dirname, '../') });
    expressApp.stdout.on('data', (data) => {
      console.log(data.toString());
      if (data.includes('listening on port 4000')) {
        resolve();
      }
    });
  });
}, 60000);
afterAll(() => {
  expressApp.kill();
});

describe("Testing user routes", () => {
  // test POST /users endpoint
  it('should return 200 when user A created', () => {
    return request(baseURL)
      .post('/users')
      .send({ publicKey: publicKeyA })
      .expect(200);
  });
  it('should return 200 OK with a msg to returning user A', () => {
    return request(baseURL)
      .post('/users')
      .send({ publicKey: publicKeyA })
      .expect(200)
      .expect(response => {
        expect(response.body.message).toBe('User already exists')
      });
  });
  it('should return 200 when user B created', () => {
    return request(baseURL)
      .post('/users')
      .send({ publicKey: publicKeyB })
      .expect(200);
  });

  // test /users/follow endpoint
  it('should return 200 when A successfully followed B', () => {
    return request(baseURL)
      .post('/users/follow')
      .send({ follower: publicKeyA, followee: publicKeyB })
      .expect(200)
      .expect(response => {
        expect(response.body.error).toBeUndefined()
      });
  });
  it('should return 200 when B successfully followed A', () => {
    return request(baseURL)
      .post('/users/follow')
      .send({ follower: publicKeyB, followee: publicKeyA })
      .expect(200)
      .expect(response => {
        expect(response.body.error).toBeUndefined()
      });
  });

  // test /users/unfollow endpoint
  it('should return 200 when A successfully unfollowed B', () => {
    return request(baseURL)
      .post('/users/unfollow')
      .send({ follower: publicKeyA, followee: publicKeyB })
      .expect(200)
      .expect(response => {
        expect(response.body.error).toBeUndefined()
      });
  });

  // test /users/isFollowed endpoint
  it('should return 200 when checking if A is following B', () => {
    return request(baseURL)
      .get(`/users/isFollowed?follower=${publicKeyA}&followee=${publicKeyB}`)
      .expect(200)
      .expect(response => {
        expect(response.body.error).toBeUndefined()
        expect(response.body.output).toBe(false)
      });
  });
  it('should return 200 when checking if B is following A', () => {
    return request(baseURL)
      .get(`/users/isFollowed?follower=${publicKeyB}&followee=${publicKeyA}`)
      .expect(200)
      .expect(response => {
        expect(response.body.error).toBeUndefined()
        expect(response.body.output).toBe(true)
      });
  });

  // if not followed, unfollow should return 500 error
  it('should return 500 when unfollowing a user that was not followed', () => {
    return request(baseURL)
      .post('/users/unfollow')
      .send({ follower: publicKeyA, followee: publicKeyB })
      .expect(500)
      .expect(response => {
        expect(response.body.error).toBeDefined()
      });
  });

  // following list of A should be empty
  it('A should not be following anyone', () => {
    return request(baseURL)
      .get(`/users/following?publicKey=${publicKeyA}`)
      .expect(200)
      .expect(response => {
        expect(response.body.error).toBeUndefined()
        expect(response.body.output.length).toBe(0)
      });
  });

  // following list of B should be A
  it('B should be following A', () => {
    return request(baseURL)
      .get(`/users/following?publicKey=${publicKeyB}`)
      .expect(200)
      .expect(response => {
        expect(response.body.error).toBeUndefined()
        expect(response.body.output[0].publicKey).toBe(publicKeyA)
      });
  });
});
