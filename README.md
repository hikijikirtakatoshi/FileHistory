# DAppsの環境構築について
## 環境について
* Truffle v5.0.17 (core: 5.0.16)
* Solidity v0.5.0 (solc-js)
* Node v10.15.1
* Web3.js v1.0.0-beta.37
* MetaMask 6.6.1

## 事前の準備
* Nodeのインストールを行う(動作が確認できているのはv10.15.1)
* MetaMaskをインストールし、初期設定を行う

## DAppsを動作させるまで
### 設定
* `git clone git@bitbucket.org:throo/filehistory.git`
* クローンしてきたフォルダに移り、`npm install`


### コントラクトのデプロイ
* `truffle develop`でTruffleのEthereumのシミュレータのコンソールに入る。
* `migrate`を実行し、ブロックチェーンにデプロイする。
* コンソールを抜け、`truffle network`を実行し、FileFactoryのコントラクトアドレスを、src/index.jsの5行目の`smartContractAddress`に代入する。

### MetaMaskの準備
* `truffle develop`を実行した際に10個のアカウントが作成され、表示される。
* 作成されたアカウントの秘密鍵が同時に表示されているので、一番上のものをコピーする。
* Metamaskで`アカウントのインポート`を開き、秘密鍵を貼り付ける。
* TruffleのシミュレータとMetaMaskの接続を行ために、MetaMaskのネットワークの設定画面を開き、`カスタムRPC`から、`truffle develop`を実行した際に表示されたURLを入力する(初期状態では`http://localhost:9545`)

### 動作させる
* `parcel src/index.html`を実行し、ブラウザで`http://localhost:1234`を開く
