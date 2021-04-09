const valueinputElement = document.getElementById('valueinput');
const valuebtnElement = document.getElementById('valuebtn');
const valueElement = document.getElementById('value');

let value;

const web3 = new Web3('ws://127.0.0.1:7545');

let currentAccount;

const updateAccount = async () => currentAccount = await web3.eth.getAccounts().then(res=>res[0]);

updateAccount();

const displayValue = (num) => {
    value = num;
    valueElement.innerHTML = value;
}

const StorageContract = new web3.eth.Contract(StorageAbi, StorageAddress);

const getInitialValue = async () => {
    const value = await StorageContract.methods.getValue().call();
    displayValue(value);
}
getInitialValue();

const updateValue = async (value) => {
    console.log(currentAccount)
    await StorageContract.methods.setValue(value).send(
        {
            from: currentAccount,
            gas: 600000,
            gasPrice: 2000000000
        }
    )
}

const handleOnSubmit = () => {
    console.log(value);
    updateValue(value);
}

const handleOnChange = (event) => {
    value = event.target.value;
    console.log(value);
}

const listenToValueUpdate = (log) => {
    const {returnValues} = log;
    const {updater, value} = returnValues;
    alert(`New value is:- ${value}. Updated by:- ${updater}.`);
    displayValue(value);
}

valueinputElement.addEventListener('change',handleOnChange);
valuebtnElement.addEventListener('click',handleOnSubmit);
StorageContract.events.ValueUpdated().on('data',listenToValueUpdate);