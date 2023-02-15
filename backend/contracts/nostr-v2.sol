// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract Nostr {

    struct Post {
        string signature; // signature of the post
        address author;  // author of the post
    }
    
    mapping(string => Post) postBySignature; // a mapping of post signature to post
    mapping(address => Post[]) postsByUser; // a mapping of user address to posts

    // create a post
    function createPost(string calldata signature, address author) external {
        Post memory post = Post(signature, author);
        postBySignature[signature] = post;
        postsByUser[author].push(post);
    }

    // get post by signature
    function getPostsByUser(address author) external view returns (Post[] memory) {
        return postsByUser[author];
    }

    // get posts by id
    function getPostBySignature(string calldata signature) external view returns (Post memory) {
        return postBySignature[signature];
    }
}
