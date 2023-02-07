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
        address[] following; // an array of public keys of users that this user is following
        address[] followers; // an array of public keys of users that follow this user
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
        User memory user = User(msg.sender, new address[](0), new address[](0));
        users[msg.sender] = user;
        AllUsers.push(user);
    }

    // checks if a user exists
    function isUser(address publicKey) public view returns (bool) {
        return users[publicKey].publicKey == publicKey;
    }

    // create a new post
    function createPost(string calldata text) external {
        require(isUser(msg.sender), "User does not exist");
        Post memory post = Post(text, block.timestamp, users[msg.sender]);
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

    // is user1 following user2
    function isFollowing(address publicKey1, address publicKey2) public view returns (bool) {
        require(isUser(publicKey1), "User does not exist");
        require(isUser(publicKey2), "User does not exist");
        for (uint i = 0; i < users[publicKey1].following.length; i++) {
            if (users[publicKey1].following[i] == publicKey2) {
                return true;
            }
        }
        return false;
    }

    // follow a user
    function follow(address publicKey) external {
        require(isUser(msg.sender), "User does not exist");
        require(isUser(publicKey), "User does not exist");
        require(msg.sender != publicKey, "Cannot follow yourself");
        require(!isFollowing(msg.sender, publicKey), "Already following");
        users[msg.sender].following.push(publicKey);
        users[publicKey].followers.push(msg.sender);
    }

    // unfollow a user
    function unfollow(address publicKey) external {
        require(isUser(msg.sender), "User does not exist");
        require(isUser(publicKey), "User does not exist");
        require(msg.sender != publicKey, "Cannot unfollow yourself");
        require(isFollowing(msg.sender, publicKey), "Not following");
        for (uint i = 0; i < users[msg.sender].following.length; i++) {
            if (users[msg.sender].following[i] == publicKey) {
                users[msg.sender].following[i] = users[msg.sender].following[users[msg.sender].following.length - 1]; // swap this element with the last element
                users[msg.sender].following.pop(); // remove last element
                break;
            }
        }
        for (uint i = 0; i < users[publicKey].followers.length; i++) {
            if (users[publicKey].followers[i] == msg.sender) {
                users[publicKey].followers[i] = users[publicKey].followers[users[publicKey].followers.length - 1]; // swap this element with the last element
                users[publicKey].followers.pop(); // remove last element
                break;
            }
        }
    }

}
