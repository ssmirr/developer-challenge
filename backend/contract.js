// Kaleido compiles the Smart Contract and generates a REST API
// --------------------------------------------------------------------------------
// Sends the contents of your contracts directory up to Kaleido on each startup.
// Kaleido compiles you code and turns into a REST API (with OpenAPI/Swagger).
// Instances can then be deployed and queried using this REST API
// Note: we really only needed when the contract actually changes.
const request = require('request-promise-native')
const archiver = require('archiver');
const Swagger = require('swagger-client');
const { URL } = require('url');
const {
  KALEIDO_REST_GATEWAY_URL,
  KALEIDO_AUTH_USERNAME,
  KALEIDO_AUTH_PASSWORD,
  CONTRACT_MAIN_SOURCE_FILE,
  CONTRACT_CLASS_NAME,
  FROM_ADDRESS,
} = require('./config');

// returns the last contract deployed's openapi
async function getLastContractSwaggerClient() {
  const url = new URL(KALEIDO_REST_GATEWAY_URL);
  url.username = KALEIDO_AUTH_USERNAME;
  url.password = KALEIDO_AUTH_PASSWORD;
  url.pathname = "/abis";
  res = await request.get({
    url: url.href,
    json: true,
    headers: { 'content-type': 'application/json' }
  });

  const openapi = res[0].openapi;

  return openapi;
}

async function deployContract() {
  const url = new URL(KALEIDO_REST_GATEWAY_URL);
  url.username = KALEIDO_AUTH_USERNAME;
  url.password = KALEIDO_AUTH_PASSWORD;
  url.pathname = "/abis";
  var archive = archiver('zip');
  archive.directory("contracts", "");
  await archive.finalize();
  const res = await request.post({
    url: url.href,
    qs: {
      compiler: "0.5", // Compiler version
      source: CONTRACT_MAIN_SOURCE_FILE, // Name of the file in the directory
      contract: `${CONTRACT_MAIN_SOURCE_FILE}:${CONTRACT_CLASS_NAME}` // Name of the contract in the 
    },
    json: true,
    headers: {
      'content-type': 'multipart/form-data',
    },
    formData: {
      file: {
        value: archive,
        options: {
          filename: 'smartcontract.zip',
          contentType: 'application/zip',
          knownLength: archive.pointer()
        }
      }
    }
  });
  // Log out the built-in Kaleido UI you can use to exercise the contract from a browser
  url.pathname = res.path;
  url.search = '?ui';
  console.log(`Generated REST API using Kaleido: ${url}`);
  return res;
}

async function getSwaggerAndAddress(redeploy = false) {
    let openapi;
    if (redeploy) {
      const res = await deployContract();
      openapi = res.openapi;
    } else {
      openapi = await getLastContractSwaggerClient();
    }

    // Store a singleton swagger client for us to use
    const swaggerClient = await Swagger(openapi, {
      requestInterceptor: req => {
        req.headers.authorization = `Basic ${Buffer.from(`${KALEIDO_AUTH_USERNAME}:${KALEIDO_AUTH_PASSWORD}`).toString("base64")}`;
      }
    });
  
    const result = await swaggerClient.apis.default.constructor_post({
      body: {},
      "kld-from": FROM_ADDRESS,
      "kld-sync": "true",
    });
  
    console.log('Connected to last deployed contract:', openapi);
  
    return { swaggerClient, contractAddress: result.body.contractAddress };
}

module.exports = { getSwaggerAndAddress }