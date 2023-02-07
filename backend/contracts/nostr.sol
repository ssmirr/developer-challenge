/**
 * a simple PoC for reimplementing Nostr as a smart contract
 * Nost is a keypair-based protocol (not based on blockchain technology, but instead implemented as websocket nodes that store things)
 * Read more here: https://github.com/nostr-protocol/nostr
 * Here I'm really just trying to get a feel for how to implement a smart contract
 * This smart contract is similar to Nostr (and its https://github.com/damus-io/damus client), but not trying to implement the full protocol
 * functionality wise, this can be seen as a social media app similar to twitter
 **/

// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;
// pragma experimental ABIEncoderV2;

contract Nostr {
    struct User {
        address publicKey; // for simplicity, I use the public key as the user id
    }

    struct Post {
        string text; // body of the post
        uint timestamp; // timestamp of the post
        User author;  // author of the post
    }

    Post[] private AllPosts; // an array of all posts
    User[] private AllUsers; // an array of all users

    mapping(address => User) users; // a mapping of public key to user
    mapping(address => Post[]) posts; // a mapping of author public key to posts (each user can have multiple posts)

    // signup to use the app
    function signup() external {
        require(!isUser(msg.sender), "User already exists");
        users[msg.sender] = User(msg.sender);
        AllUsers.push(User(msg.sender));
    }

    // checks if a user exists
    function isUser(address publicKey) public view returns (bool) {
        return users[publicKey].publicKey == publicKey;
    }

    // create a new post
    function createPost(string calldata text) external {
        require(isUser(msg.sender), "User does not exist");
        Post memory post = Post(text, block.timestamp, User(msg.sender));
        posts[msg.sender].push(post);
        AllPosts.push(post);
    }

    // get posts of a user
    function getPosts(address publicKey) external view returns (Post[] memory) {
        require(isUser(publicKey), "User does not exist");
        return posts[publicKey];
    }

    // get all users
    function getAllUsers() public view returns (User[] memory) {
        return AllUsers;
    }

    // get all posts
    function getAllPosts() public view returns (Post[] memory) {
        return AllPosts;
    }
}
