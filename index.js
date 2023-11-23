 // Import Push SDK & Ethers
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { ethers } from "ethers";

// Creating a random signer from a wallet, ideally this is the wallet you will connect
const signer = ethers.Wallet.createRandom();

// Initialize wallet user
// 'CONSTANTS.ENV.PROD' -> mainnet apps | 'CONSTANTS.ENV.STAGING' -> testnet apps
const userAlice = await PushAPI.initialize(signer, { env: CONSTANTS.ENV.STAGING });

// This will be the wallet address of the recipient
const bobWalletAddress = "0x99A08ac6254dcf7ccc37CeC662aeba8eFA666666";

// Send a message to Bob
// userAlice.chat.send(recipient, {message})
// recipient - Can be wallet address, nft address or chatid | See Types of Recipient for more info
// message - Can be modified to send various types of messages like Images, Reactions, etc
const aliceMessagesBob = await userAlice.chat.send(bobWalletAddress, {
    type: "Text",
    content: "Hello Bob!",
});
console.log(aliceMessagesBob);

// Initialize Stream
const stream = await userAlice.initStream([CONSTANTS.STREAM.CHAT]);

// Configure stream listen events and what to do
stream.on(CONSTANTS.STREAM.CHAT, (message) => {
  console.log(message);
});

// userAlice.chat.list(type, {options?})
const aliceChats = await userAlice.chat.list("CHATS");
console.log(aliceChats);

  // We are going to create a group that is:
  // Private - All conversations in this group is encrypted and visible only to members of the group
  // Gated entry by either of two rules
  // Gated entry - Rule 1 - It takes 10 $XYZ token on Ethereum or on Polygon to join the group
  // Gated chat by rule of having $1000 XYZ on Ethereum token to allow sending chat in the group
  const myTokenGatedGroup = await userAlice.chat.group.create('BRB Chat', {
    description: 'This is your DAO community native web3 chat', // provide short description of group
    image: 'data:image/png;base64,iVBORw0K...', // provide base64 encoded image
    members: ['0x123...', '0xABC...', 'eip155:0x754...'], // see types of recipient to learn more
    admins: ['nft:eip155:11155111:0x42af3147f17239341477113484752D5D3dda997B:2:1683058528'], // NFT addresses are supported as well
    private: true, // ensures chat within group is encrypted and is only visible to members of the group
    rules: { // define rules to gate different permissions of the group, ie: joining group or sending messages
      "entry": { // define condition for joining the group
        "conditions": { // set of all conditions that should be fulfilled to join the group
          "any": [
            {
              "any": [ // set decider to 'any', if 'and' then all rules need to be fulfilled
                { // define criteria 1
                  "type": "PUSH",
                  "category": "INVITE",
                  "subcategory": "DEFAULT",
                  "data": {
                      "inviterRoles": [
                          "ADMIN",
                          "OWNER"
                      ]
                  }
                },
                { // define criteria 2
                  type: "PUSH", // define type that rules engine should go for, currently supports PUSH or GUILD
                  category: "ERC20", // define it's ERC20 token that you want to check, supports ERC721 as well
                  subcategory: "holder", // define if you are checking 'holder' or 'owner'
                  data: { // define the data check
                    "contract": "eip155:1:0xBE18197d1c071b72fb2460B1652C96C22d40F1D9", // pass {blockchain_standard}:{chain_id}:{address} as a shorthand
                    "comparison": ">=", // what comparison needs to pass
                    "amount": 10, // amount that needs to passed
                    "decimals": 18, // the decimals for the contract
                  }
                },
                { // define criteria 3
                  type: "PUSH", // define type that rules engine should go for, currently supports PUSH or GUILD
                  category: "ERC20", // define it's ERC20 token that you want to check, supports ERC721 as well
                  subcategory: "holder", // define if you are checking 'holder' or 'owner'
                  data: { // define the data check
                    "contract": "eip155:137:0xBE18197d1c071b72fb2460B1652C96C22d40F1D9", // assuming $XYZ contract address is 0xBE18197d1c071b72fb2460B1652C96C22d40F1D9
                    "comparison": ">=", // what comparison needs to pass
                    "amount": 10, // amount that needs to passed
                    "decimals": 18, // the decimals for the contract
                  }
                }
              ]
            }
          ]
        }
      },
      "chat": {
        "conditions": { // define condition for sending message in the group
          "all": [
            {
              "any": [ // set decider to 'any', if 'and' then all rules need to be fulfilled
                { // define criteria 1
                  "type": "PUSH", // define type that rules engine should go for, currently supports PUSH or GUILD
                  "category": "ERC20", // define it's ERC20 token that you want to check, supports ERC721 as well
                  "subcategory": "holder", // define if you are checking 'holder' or 'owner'
                  "data": { // define the data check
                    "contract": "eip155:1:0xBE18197d1c071b72fb2460B1652C96C22d40F1D9", // pass {blockchain_standard}:{chain_id}:{address} as a shorthand
                    "comparison": ">=", // what comparison needs to pass
                    "amount": 1000, // amount that needs to passed
                    "decimals": 18, // the decimals for the contract
                  }
                }
              ]
            }
          ]
        }
      }
    }
  });
console.log("Chat created successfully!", myTokenGatedGroup);





// Connect Stream
stream.connect();