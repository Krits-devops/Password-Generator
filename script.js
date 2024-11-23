const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyButton = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const indicator = document.querySelector("[data-indicator]");

let password = "";
let passwordLength = 10;
let checkCount = 0;
let symbols = '"!@#$%^&*()_+~`|}{[]:;';

handleSlider();
// set strenght colour to grey

setIndicator("#ccc")

// set password lenght

function handleSlider (){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "100%" ;
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getrandomInteger (min, max){
  return  Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getrandomInteger(0,9);
}

function generateLowerCase() {
   return String.fromCharCode(getrandomInteger(97,123));
}

function generateUpperCase() {
    return String.fromCharCode(getrandomInteger(65,91));
 }

 function generateSymbol() {
    const randNum = getrandomInteger(0 , symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSys = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSys = true;


    if (hasUpper && hasLower && (hasNum || hasSys) && passwordLength >=8){
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNum || hasSys) & passwordLength >=6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }

}

async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = 'copied';
    }catch(e){
        copyMsg.innerText = "error";
    }

    // To make copied mssg visible
    copyMsg.classList.add('active');

    setTimeout(() =>{
        copyMsg.classList.remove("active");
    },2000)
} 

function shufflePassword(array){
    // Fisher Yates Method

    for(let i = array.length-1 ; i>0 ;i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el)=>(str += el));
    return str;

}

function handleCheckboxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox=>{
        if(checkbox.checked){
            checkCount++;
        }
    }))

    //special Condition

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}


allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckboxChange);
})


inputSlider.addEventListener('input', (e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

copyButton.addEventListener('click',()=>{
    if(passwordDisplay.value)
        copyContent();
}) 

generateBtn.addEventListener('click', ()=>{
    // none of the checkbox are selected
    if(checkCount <=0) 
        return;

    if(passwordLength <checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    //finding new password
    password = '';

    // let put the mentioned items by checkbox

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }

    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }

    let funcArr = [];
    if (uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //cumpulsory  Addition

    for(let i = 0;i<funcArr.length;i++){
        password += funcArr[i]();
    }

    //remaning Addition 

    for(let i=0; i < passwordLength-funcArr.length;i++){
       let randIndex = getrandomInteger (0,funcArr.length);
       password += funcArr[randIndex]();
    }

    // password shuffuling
    password = shufflePassword(Array.from(password));


    // Displaying the password
    passwordDisplay.value = password;

    calcStrength();

})