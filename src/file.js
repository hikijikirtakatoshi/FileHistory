import "babel-polyfill";
import Web3 from "web3";
import sha256 from 'js-sha256';
import File from '../build/contracts/File.json';

let myAccount;
let web3;
let contractInstance;
var smartContractAddress = getContractAddress();

async function initApp() {
    myAccount = (await web3.eth.getAccounts())[0];
    contractInstance = new web3.eth.Contract(File.abi, smartContractAddress);
}

function getContractAddress() {
  var url = location.href;
  var paramaters = url.split("=");
  var contractAddress = paramaters[1];
  console.log(contractAddress, "ok");
  return contractAddress;
}

window.addUpdater = async() => {
  try {
    let option = {
            from: myAccount,
            gasPrice: "20000000000",
            gas: "4100000",
        };
    const updaterAddress = document.getElementById("addUpdater").value;
    alert(updaterAddress);
    await contractInstance.methods.addAdmin(updaterAddress).send(option);
  } catch (err) {
    console.log(err);
  }
}

window.syncLastestFile = async() => {
  try {
  
    let lastestFile = await contractInstance.methods.getLastestFile().call();
    console.log(lastestFile);
    showLastestFileData(lastestFile);
  } catch (err) {
    console.log(err);
  }
}

var file = document.getElementById('selectFile');
var fileData;
file.addEventListener('change', function(e) {
    var result = e.target.files[0];
    var reader = new FileReader();
    reader.readAsBinaryString(result);
    reader.addEventListener('load', function() {
        fileData = sha256(reader.result);
    })
}, false);

window.updateFile = async () => {
    if (fileData == null) { return alert("ファイルを選択してください"); }

    try {
        let option = {
            from: myAccount,
            gasPrice: "20000000000",
            gas: "4100000",
        };
        const result = await contractInstance.methods.updateFile(fileData).send(option);

    } catch (err) {
        console.log(err);
    }
};

var checkfile = document.getElementById('selectcheckFile');
var checkfileData;
checkfile.addEventListener('change', function(e) {
    var checkresult = e.target.files[0];
    var checkreader = new FileReader();
    checkreader.readAsBinaryString(checkresult);
    checkreader.addEventListener('load', function() {
        checkfileData = sha256(checkreader.result);
        console.log(checkfileData);
        alert(checkfileData);
    })
}, false);

window.deleteContract = async () => {
  try {
    let option = {
            from: myAccount,
            gasPrice: "20000000000",
            gas: "4100000",
        };
      await contractInstance.methods.destory().send(option);
      var url = "./index.html";
      location.assign(url);
  } catch (err) {
        console.log(err);
    }
}

window.addUpdater = async () => {
  try {
    let option = {
            from: myAccount,
            gasPrice: "20000000000",
            gas: "4100000",
        };
      const addAddress = document.getElementById("addAddress").value;
      await contractInstance.methods.addAdmin(addAddress).send(option);
      document.getElementById("addAddress").value = "";

  } catch (err) {
        console.log(err);
    }
}

window.removeUpdater = async () => {
  try {
    let option = {
            from: myAccount,
            gasPrice: "20000000000",
            gas: "4100000",
        };
      const removeAddress = document.getElementById("removeAddress").value;
      await contractInstance.methods.removeAdmin(removeAddress).send(option);
      document.getElementById("removeAddress").value = "";

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

function showLastestFileData(lastestFile) {
  let hashTitle = "ハッシュ値" + "\n" + lastestFile[0] + "\n";
  let updateraddress = "更新者" + "\n" + lastestFile[1] + "\n";
  let d  = new Date(lastestFile[2] * 1000);
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  let day = d.getDate();
  var hour = ( d.getHours()   < 10 ) ? '0' + d.getHours()   : d.getHours();
  var min  = ( d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
  var sec   = ( d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();
  let updateTime = "更新時刻" + "\n" + year + '年' + month + '月' + day + '日' + hour + ':' + min + ':' + sec;

  document.getElementById("lastestFile").innerText = hashTitle + updateraddress + updateTime;
}
