/**
 * a simple PoC for reimplementing Nostr as a smart contract
 * Nostr is a keypair-based protocol (not based on blockchain technology, but instead implemented as websocket nodes that store things)
 * Read more here: https://github.com/nostr-protocol/nostr
 * Here I'm really just trying to get a feel for how to implement a smart contract
 * This smart contract is similar to Nostr (and its https://github.com/damus-io/damus client), but not trying to implement the full protocol
 * functionality wise, this can be seen as a social media app similar to twitter
 **/

// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract Nostr {
    struct User {
        address publicKey; // for simplicity, I use the public key as the user id
        address[] following; // an array of public keys of users that this user is following
        address[] followers; // an array of public keys of users that follow this user
    }

    struct Post {
        uint id; // id of the post (for simplicity, I use the index of the post in the array of all posts, just good enough for this PoC)
        string text; // body of the post
        uint timestamp; // timestamp of the post
        User author;  // author of the post
    }

    event NewPost(Post post);

    Post[] private AllPosts; // an array of all posts
    User[] private AllUsers; // an array of all users

    mapping(address => User) users; // a mapping of public key to user
    mapping(address => Post[]) posts; // a mapping of author public key to posts (each user can have multiple posts)

    // create a new user
    function createUser(address publicKey) external {
        require(!isUser(publicKey), "User already exists");
        User memory user = User(publicKey, new address[](0), new address[](0));
        users[publicKey] = user;
        AllUsers.push(user);
    }

    // checks if a user exists
    function isUser(address publicKey) public view returns (bool) {
        return users[publicKey].publicKey == publicKey;
    }

    // create a new post, give the text and user
    function createPost(string calldata text, address publicKey) external {
        require(isUser(publicKey), "User does not exist");
        // require(users[publicKey].publicKey == msg.sender, "User does not match");
        Post memory post = Post(AllPosts.length, text, block.timestamp, users[publicKey]);
        AllPosts.push(post);
        posts[publicKey].push(post);

        // emit event
        emit NewPost(post);
    }

    // get posts of a user
    function getPostsByUser(address publicKey) external view returns (Post[] memory) {
        require(isUser(publicKey), "User does not exist");
        return posts[publicKey];
    }

    // get posts by id
    function getPostById(uint id) external view returns (Post memory) {
        require(id < AllPosts.length, "Post does not exist");
        return AllPosts[id];
    }

    // get all users
    function getAllUsers() public view returns (User[] memory) {
        return AllUsers;
    }

    // get all posts
    function getAllPosts() public view returns (Post[] memory) {
        return AllPosts;
    }

    // is user A following user B
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

    // follow a user (add user B to following list of user A and add user A to followers list of user B). given the public keys of user A and user B
    function follow(address publicKey1, address publicKey2) external {
        require(isUser(publicKey1), "User does not exist");
        require(isUser(publicKey2), "User does not exist");
        require(publicKey1 != publicKey2, "Cannot follow yourself");
        require(!isFollowing(publicKey1, publicKey2), "Already following");
        users[publicKey1].following.push(publicKey2);
        users[publicKey2].followers.push(publicKey1);
    }

    // unfollow a user (remove user B from following list of user A and remove user A from followers list of user B). given the public keys of user A and user B
    function unfollow(address publicKey1, address publicKey2) external {
        require(isUser(publicKey1), "User does not exist");
        require(isUser(publicKey2), "User does not exist");
        require(publicKey1 != publicKey2, "Cannot unfollow yourself");
        require(isFollowing(publicKey1, publicKey2), "Not following");
        for (uint i = 0; i < users[publicKey1].following.length; i++) {
            if (users[publicKey1].following[i] == publicKey2) {
                users[publicKey1].following[i] = users[publicKey1].following[users[publicKey1].following.length - 1];
                users[publicKey1].following.pop();
                break;
            }
        }
        for (uint i = 0; i < users[publicKey2].followers.length; i++) {
            if (users[publicKey2].followers[i] == publicKey1) {
                users[publicKey2].followers[i] = users[publicKey2].followers[users[publicKey2].followers.length - 1];
                users[publicKey2].followers.pop();
                break;
            }
        }
    }

    // get all users that given user is following
    function getFollowing(address publicKey) external view returns (User[] memory) {
        require(isUser(publicKey), "User does not exist");
        User[] memory following = new User[](users[publicKey].following.length);
        for (uint i = 0; i < users[publicKey].following.length; i++) {
            following[i] = users[users[publicKey].following[i]];
        }
        return following;
    }
}
