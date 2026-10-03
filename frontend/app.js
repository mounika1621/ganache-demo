const CONTRACT_ADDRESS = "0xaCFD0f00402a72BF140dB9Cd2c242C603f39C88c";

const GANACHE_CHAIN_ID = "0x539";

let provider;
let signer;
let contract;


// ABI of FoodTraceability contract
const CONTRACT_ABI = [

    "function productCount() view returns (uint256)",

    "function addProduct(string _productName, string _farmerName, string _origin)",

    "function updateStage(uint256 _productId, string _stageName, string _actorName, string _location)",

    "function getProduct(uint256 _productId) view returns (uint256, string, string, string, uint256, bool)",

    "function getHistoryCount(uint256 _productId) view returns (uint256)",

    "function getStage(uint256 _productId, uint256 _index) view returns (string, string, string, uint256)"
];


// -------------------------------
// Connect MetaMask
// -------------------------------

document
    .getElementById("connectButton")
    .addEventListener("click", connectMetaMask);


async function connectMetaMask() {

    try {

        if (!window.ethereum) {
    document.getElementById("walletStatus").innerText =
        "MetaMask not detected. Please refresh the page.";
    return;
}

        // Check current network
        const chainId = await window.ethereum.request({
            method: "eth_chainId"
        });

        console.log("Current Chain ID:", chainId);

        // Switch to Ganache
        if (chainId !== GANACHE_CHAIN_ID) {

            try {

                await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [
                        {
                            chainId: GANACHE_CHAIN_ID
                        }
                    ]
                });

            } catch (switchError) {

                // If network does not exist, add it
                if (switchError.code === 4902) {

                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: GANACHE_CHAIN_ID,
                                chainName: "Ganache Local",
                                nativeCurrency: {
                                    name: "Ethereum",
                                    symbol: "ETH",
                                    decimals: 18
                                },
                                rpcUrls: [
                                    "http://127.0.0.1:7545"
                                ]
                            }
                        ]
                    });

                } else {

                    throw switchError;
                }
            }
        }


        // Create ethers provider
        provider = new ethers.BrowserProvider(
            window.ethereum
        );

        // Get wallet
        signer = await provider.getSigner();

        const address = await signer.getAddress();

        // Create contract instance
        contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            CONTRACT_ABI,
            signer
        );


        document.getElementById("walletStatus").innerText =
            "Connected: " +
            address;

        console.log("MetaMask connected:", address);

    } catch (error) {

        console.error(error);

        document.getElementById("walletStatus").innerText =
            "Connection failed";

    }
}


// -------------------------------
// Add Product
// -------------------------------

document
    .getElementById("addProductButton")
    .addEventListener("click", addProduct);


async function addProduct() {

    try {

        if (!contract) {

            alert("Please connect MetaMask first.");

            return;
        }


        const productName =
            document.getElementById("productName").value;

        const farmerName =
            document.getElementById("farmerName").value;

        const origin =
            document.getElementById("origin").value;


        if (!productName || !farmerName || !origin) {

            alert("Please fill all fields.");

            return;
        }


        document.getElementById("message").innerText =
            "Waiting for MetaMask confirmation...";


        const transaction =
            await contract.addProduct(
                productName,
                farmerName,
                origin
            );


        document.getElementById("message").innerText =
            "Transaction submitted. Waiting for blockchain confirmation...";


        console.log(
            "Transaction:",
            transaction.hash
        );


        await transaction.wait();


        document.getElementById("message").innerText =
            "✅ Product added successfully!";


        console.log(
            "Product added:",
            transaction.hash
        );


    } catch (error) {

        console.error(error);

        document.getElementById("message").innerText =
            "❌ Transaction failed.";

    }
}


// -------------------------------
// Update Stage
// -------------------------------

document
    .getElementById("updateStageButton")
    .addEventListener("click", updateStage);


async function updateStage() {

    try {

        if (!contract) {

            alert("Please connect MetaMask first.");

            return;
        }


        const productId =
            document.getElementById("productId").value;

        const stageName =
            document.getElementById("stageName").value;

        const actorName =
            document.getElementById("actorName").value;

        const location =
            document.getElementById("stageLocation").value;


        if (!productId || !actorName || !location) {

            alert("Please fill all fields.");

            return;
        }


        document.getElementById("message").innerText =
            "Waiting for MetaMask confirmation...";


        const transaction =
            await contract.updateStage(
                productId,
                stageName,
                actorName,
                location
            );


        document.getElementById("message").innerText =
            "Transaction submitted...";


        console.log(
            "Transaction:",
            transaction.hash
        );


        await transaction.wait();


        document.getElementById("message").innerText =
            "✅ Stage updated successfully!";


    } catch (error) {

        console.error(error);

        document.getElementById("message").innerText =
            "❌ Stage update failed.";

    }
}


// -------------------------------
// View Product
// -------------------------------

document
    .getElementById("viewProductButton")
    .addEventListener("click", viewProduct);


async function viewProduct() {

    try {

        if (!contract) {

            alert("Please connect MetaMask first.");

            return;
        }


        const productId =
            document.getElementById("viewProductId").value;


        const product =
            await contract.getProduct(productId);


        const productDetails =
            document.getElementById("productDetails");


        if (!product[5]) {

            productDetails.innerHTML =
                "<p>Product does not exist.</p>";

            return;
        }


        const date =
            new Date(
                Number(product[4]) * 1000
            );


        productDetails.innerHTML = `

            <div class="product-box">

                <h3>Product #${product[0]}</h3>

                <p>
                    <strong>Product:</strong>
                    ${product[1]}
                </p>

                <p>
                    <strong>Farmer:</strong>
                    ${product[2]}
                </p>

                <p>
                    <strong>Origin:</strong>
                    ${product[3]}
                </p>

                <p>
                    <strong>Created:</strong>
                    ${date.toLocaleString()}
                </p>

            </div>

        `;

    } catch (error) {

        console.error(error);

        document.getElementById("productDetails").innerHTML =
            "<p>Unable to load product.</p>";

    }
}


// -------------------------------
// View History
// -------------------------------

document
    .getElementById("historyButton")
    .addEventListener("click", viewHistory);


async function viewHistory() {

    try {

        if (!contract) {

            alert("Please connect MetaMask first.");

            return;
        }


        const productId =
            document.getElementById("viewProductId").value;


        const count =
            await contract.getHistoryCount(productId);


        const history =
            document.getElementById("history");


        history.innerHTML = "";


        for (
            let i = 0;
            i < Number(count);
            i++
        ) {

            const stage =
                await contract.getStage(
                    productId,
                    i
                );


            const date =
                new Date(
                    Number(stage[3]) * 1000
                );


            history.innerHTML += `

                <div class="history-item">

                    <h3>
                        ${stage[0]}
                    </h3>

                    <p>
                        <strong>Actor:</strong>
                        ${stage[1]}
                    </p>

                    <p>
                        <strong>Location:</strong>
                        ${stage[2]}
                    </p>

                    <p>
                        <strong>Time:</strong>
                        ${date.toLocaleString()}
                    </p>

                </div>

            `;
        }


    } catch (error) {

        console.error(error);

        document.getElementById("history").innerHTML =
            "<p>Unable to load history.</p>";

    }
}


// -------------------------------
// Detect account changes
// -------------------------------

if (window.ethereum) {

    window.ethereum.on(
        "accountsChanged",
        function () {

            window.location.reload();

        }
    );


    window.ethereum.on(
        "chainChanged",
        function () {

            window.location.reload();

        }
    );
}