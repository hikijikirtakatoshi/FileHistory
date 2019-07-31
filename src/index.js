import "babel-polyfill";
import Web3 from "web3";
import sha256 from 'js-sha256';
import FileFactory from '../build/contracts/FileFactory.json';

const smartContractAddress = "0xF9f210d8Ec2320e539feF2d36346300318c505Bf";
let myAccount;
let web3;
let contractInstance;

async function initApp() {
    myAccount = (await web3.eth.getAccounts())[0];
    contractInstance = new web3.eth.Contract(FileFactory.abi, smartContractAddress);
}

var file = document.getElementById('selectFile');
var fileData;
file.addEventListener('change', function(e) {
    let result = e.target.files[0];
    let reader = new FileReader();
    reader.readAsBinaryString(result);
    reader.addEventListener('load', function() {
        fileData = sha256(reader.result);
    })
}, false);

window.resisterFile = async () => {
    if (!fileData) { alert("ファイルを選択してください"); }

    try {
        let option = {
            from: myAccount,
            gasPrice: "20000000000",
            gas: "4100000",
        };
        const contractName = document.getElementById("contactName").value;
        await contractInstance.methods.createFileContract(fileData, contractName).send(option);
    } catch (err) {
        console.log(err);
    }
};

window.change = async() => {
  try {
    const contractAddress = document.getElementById("contactAddress").value;
    let url = "./file.html" + "?address=" + contractAddress;
    console.log(contactAddress);
    location.assign(url);
    document.getElementById("contactAddress").value = null;
  } catch (err) {
    console.log(err);
  }
}

window.deleteContract = async () => {
  try {

    let res = confirm("コントラクトを削除しますか?");
    let option = {
            from: myAccount,
            gasPrice: "20000000000",
            gas: "4100000",
        };
      if(res) { await contractInstance.methods.destory().send(option); }
  } catch (err) {
        console.log(err);
    }
}

window.getContracts = async () => {
  try {
        document.getElementById("contract").innerText = null
        const result = await contractInstance.methods.getDeployedFileContract().call();
        console.log(result);
        result.reverse();
        let showLimit = 10;
        let numberOfContracts = showLimit;
        if(result.length < showLimit) { numberOfContracts = result.length; }

        for(let i = 0; i < numberOfContracts; i++) {
          const contractName = await contractInstance.methods.getFileName(result[i]).call();
          const contractCreater = await contractInstance.methods.getCreater(result[i]).call();
          createContractBox(result[i], contractCreater, contractName);
        }
  } catch (err) {
        console.log(err);
    }
}

window.addEventListener('load', async function() {
    if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
        let provider = window['ethereum'] || window.web3.currentProvider;
        await provider.enable();
        web3 = new Web3(provider);
    } else {
        console.log('METAMASK NOT DETECTED');
    }
    initApp();
});

function createContractBox(address, contractCreater, name) {
  let addressBox = document.createElement("div");
  addressBox.className = "addressBox";
  let idAddressBox = "addressBox" + address;
  addressBox.id = idAddressBox;

  let link = document.createElement("a");
  link.className = "link";
  link.innerText = address;
  link.setAttribute( "href", "./file.html" + "?address=" + address);

  let contractBox = document.createElement("div");
  contractBox.className = "contractBox";
  let idContractBox = "contractBox" + address;
  contractBox.id  = idContractBox;
  contractBox.innerText = contractCreater + "\n" + name;

  document.getElementById("contract").appendChild(contractBox);
  document.getElementById(idContractBox).appendChild(addressBox);
  document.getElementById(idAddressBox).appendChild(link);
}



