const { getSwaggerAndAddress } = require('./contract');

const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors')
const app = express();
const server = require('http').Server(app);
const socket = require('socket.io');
const { ethers } = require('ethers');

const { PORT, FROM_ADDRESS } = require('./config');

const io = socket(server, { transports: ['websocket'] });
io.sockets.on('connection', socket => {
  console.log('New ws client connected...');

  socket.on('login', async (publicKey) => {
    console.log('login ws:', publicKey);
    try {
      const result = await swaggerClient.apis.default.getFollowing_get({
        address: contractAddress,
        publicKey,
        body: {
          publicKey
        },
        "kld-from": FROM_ADDRESS,
        "kld-sync": "true"
      });
      if (result.body?.output?.length > 0) {
        result.body.output.forEach((user) => {
          console.log('subscribing to ws:', user.publicKey)
          socket.join(user.publicKey);
        });
      }
    }
    catch (err) {
      console.error('error getting following list: ', err);
    }
  });

  socket.on('logout', (publicKey) => {
    console.log('logout ws:', publicKey);
    // leave all rooms
    Object.keys(socket.rooms).forEach(room => {
      socket.leave(room);
    });
  });

  socket.on('follow', async (publicKey) => {
    console.log('follow ws:', publicKey);
    socket.join(publicKey);
  });

  socket.on('unfollow', async (publicKey) => {
    console.log('unfollow ws:', publicKey);
    socket.leave(publicKey);
  });

  socket.on('disconnect', () => console.log('Client disconnected'));
});

const postRoutes = express.Router();
const userRoutes = express.Router();

app.use(cors());
app.use(bodyparser.json());
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

let swaggerClient;
let contractAddress;

(async () => {
  const contract = await getSwaggerAndAddress(process.env.DEPLOY);
  swaggerClient = contract.swaggerClient;
  contractAddress = contract.contractAddress;
  server.listen(PORT, () => console.log(`Kaleido DApp backend listening on port ${PORT}!`))
})();


/************** ROUTES **************
 * The following routes can/should be moved to their own files (e.g. /routes/*.js) and imported here.
 * This is just to keep the code in one place for the purposes of this demo.
 * TODO: move routes to their own files when deploy script is ready & separated from start up logic
 ************************************/

//  login
userRoutes.post('/', async (req, res) => {
  try {
    const { publicKey } = req.body;
    const result = await swaggerClient.apis.default.createUser_post({
      address: contractAddress,
      body: {
        publicKey
      },
      "kld-from": FROM_ADDRESS,
      "kld-sync": "true" // TODO: if found time, checkout async mode
    });
  
    console.log(result)
    res.status(200).send(result.body);
  }
  catch (err) {
    if (err.response && err.response.body && err.response.body.error && err.response.body.error.includes('already exists')) {
      res.status(200).send({ message: 'User already exists' });
    }
    else {
      res.status(500).send({ error: `${err.response && JSON.stringify(err.response.body) && err.response.text}\n${err.stack}` });
    }
  }
});

// get all users
userRoutes.get('/', async (req, res) => {
  try {
    const result = await swaggerClient.apis.default.getAllUsers_get({
      address: contractAddress,
      "kld-from": FROM_ADDRESS,
      "kld-sync": "true"
    });

    res.status(200).send(result.body);
  }
  catch (err) {
    console.error(err);
    res.status(500).send({ error: `${err.response && JSON.stringify(err.response.body) && err.response.text}\n${err.stack}` });
  }
});

// follow another user
userRoutes.post('/follow', async (req, res) => {
  try {
    const { follower, followee } = req.body;
    const result = await swaggerClient.apis.default.follow_post({
      address: contractAddress,
      body: {
        publicKey1: follower,
        publicKey2: followee
      },
      "kld-from": FROM_ADDRESS,
      "kld-sync": "true"
    });

    res.status(200).send(result.body);
  }
  catch (err) {
    console.error(err);
    res.status(500).send({ error: `${err.response && JSON.stringify(err.response.body) && err.response.text}\n${err.stack}` });
  }
});

// unfollow another user
userRoutes.post('/unfollow', async (req, res) => {
  try {
    const { follower, followee } = req.body;
    const result = await swaggerClient.apis.default.unfollow_post({
      address: contractAddress,
      body: {
        publicKey1: follower,
        publicKey2: followee
      },
      "kld-from": FROM_ADDRESS,
      "kld-sync": "true"
    });
    res.status(200).send(result.body);
  }
  catch (err) {
    console.error(err);
    res.status(500).send({ error: `${err.response && JSON.stringify(err.response.body) && err.response.text}\n${err.stack}` });
  }
});

// is user following another user
userRoutes.get('/isFollowed', async (req, res) => {
  try {
    const { follower, followee } = req.query;
    const result = await swaggerClient.apis.default.isFollowing_get({
      address: contractAddress,
      publicKey1: follower,
      publicKey2: followee,
      "kld-from": FROM_ADDRESS,
      "kld-sync": "true"
    });
    res.status(200).send(result.body);
  }
  catch (err) {
    console.error(err);
    res.status(500).send({ error: `${err.response && JSON.stringify(err.response.body) && err.response.text}\n${err.stack}` });
  }
});

// get all following of a user
userRoutes.get('/following', async (req, res) => {
  try {
    const { publicKey } = req.query;
    const result = await swaggerClient.apis.default.getFollowing_get({
      address: contractAddress,
      publicKey,
      body: {
        publicKey
      },
      "kld-from": FROM_ADDRESS,
      "kld-sync": "true"
    });
    res.status(200).send(result.body);
  }
  catch (err) {
    console.error(err);
    res.status(500).send({ error: `${err.response && JSON.stringify(err.response.body) && err.response.text}\n${err.stack}` });
  }
});

// get all posts from a user
userRoutes.get('/:publicKey', async (req, res) => {
  const { publicKey } = req.params;
  try {
    const result = await swaggerClient.apis.default.getPostsByUser_get({
      address: contractAddress,
      publicKey,
      "kld-from": FROM_ADDRESS,
      "kld-sync": "true"
    });
    res.status(200).send(result.body);
  }
  catch (err) {
    console.error(err);
    res.status(500).send({ error: `${err.response && JSON.stringify(err.response.body) && err.response.text}\n${err.stack}` });
  }
});

// getting all posts
postRoutes.get('/', async (req, res) => {
  try {
    const result = await swaggerClient.apis.default.getAllPosts_get({
      address: contractAddress,
      "kld-from": FROM_ADDRESS,
      "kld-sync": "true"
    });
    res.status(200).send(result.body);
  }
  catch (err) {
    console.error(err);
    res.status(500).send({ error: `${err.response && JSON.stringify(err.response.body) && err.response.text}\n${err.stack}` });
  }
});

// creating a post
postRoutes.post('/', async (req, res) => {
  try {
    const { publicKey, text, signature } = req.body;

    // verify signature + public key match
    const signerAddress = ethers.utils.verifyMessage(text, signature);
    if (signerAddress.toLowerCase() !== publicKey.toLowerCase()) {
      res.status(500).send({ error: `Signature does not match public key. Signer address: "${signerAddress.toLowerCase()}" , address: "${publicKey.toLowerCase()}"` });
      return;
    }

    console.log('creating post for', publicKey, text);
    const result = await swaggerClient.apis.default.createPost_post({
      address: contractAddress,
      body: {
        publicKey,
        text
      },
      "kld-from": FROM_ADDRESS,
      "kld-sync": "true"
    });

    const timestamp = Math.floor(Date.now() / 1000);
    const wsPayload = { author: { publicKey }, text, timestamp, id: timestamp };
    io.in(publicKey).emit('newSubscribedPost', wsPayload);
    io.emit('newPost', wsPayload);

    res.status(200).send(result.body);
  }
  catch (err) {
    console.error(err);
    res.status(500).send({ error: `${err.response && JSON.stringify(err.response.body) && err.response.text}\n${err.stack}` });
  }
});

// getting a specific post
postRoutes.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await swaggerClient.apis.default.getPostById_post({
      address: contractAddress,
      body: {
        id
      },
      "kld-from": FROM_ADDRESS,
      "kld-sync": "true"
    });
    res.status(200).send(result.body);
  }
  catch (err) {
    console.error(err);
    res.status(500).send({ error: `${err.response && JSON.stringify(err.response.body) && err.response.text}\n${err.stack}` });
  }
});

// TODO: liking a specific post
// TODO: unliking a specific post (undo like)
// TODO: sharing a specific post

// TODO: deleting a specific post
// postRoutes.delete('/:id', (req, res) => {
//     res.send('post deleted');
// });

// TODO: edit a specific post
// Twitter doesn't allow you to edit a tweet, so we won't either :P
// postRoutes.patch('/:id', (req, res) => {
//     res.send('post edited');
// });
