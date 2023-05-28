const password = require("./passgenerator");
const CryptoJS = require("crypto-js");

const dropZone = document.querySelector(".aes-dropwindow");
const passfield = document.querySelector("#passInputArea");
const visibilityButton = document.getElementById("Seepassbutton");
const visibilityToggler = document.getElementById("visImgae");
const passGenButton = document.getElementById("generateButton");
const encryptButton = document.getElementById("encryptButton");
const resetButton = document.getElementById("resetButton");
const decryptButton = document.getElementById("decryptButton");

let contextPassword = null;
let OnprocessContentFiles = [];
let decryptedFiles = [];


function change() {
    const darkEl = document.body;
    darkEl.classList.toggle("dark_mode");
}

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("hover-Dragover");
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("hover-Dragover");
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();

    const newFiles = e.dataTransfer.files;
    for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i];
        const reader = new FileReader();
        reader.onload = (e) => {
            OnprocessContentFiles.push({
                name: file.name,
                content: e.target.result
            });
        };
        reader.readAsText(file);
    }
    dropZone.innerText = "Added " + newFiles.length + " file(s)";
    dropZone.classList.add("greenBB");
});

visibilityButton.addEventListener("click", () => {
    if (passfield.type === "password") {
        visibilityToggler.setAttribute("src", "./Images/visibility_off_FILL0_wght400_GRAD0_opsz48.png");
        passfield.type = "text";
    } else {
        visibilityToggler.setAttribute("src", "./Images/visibility_FILL0_wght400_GRAD0_opsz48.png");
        passfield.type = "password";
    }
});

passGenButton.addEventListener("click", () => {
    const pass = new password();
    const encPass = pass.generatePassword(16);
    contextPassword = encPass;
    passfield.value = contextPassword;
});

encryptButton.addEventListener("click", () => {
    if (!contextPassword) {
        alert("Please generate a password first.");
        return;
    }
    if (OnprocessContentFiles.length === 0) {
        alert("Please drop files to encrypt.");
        return;
    }

    let filesProcessed = 0;
    OnprocessContentFiles.forEach((file) => {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        let encryptedBlob, encryptedFileName;

        if (fileExtension === 'csv' || fileExtension === 'pdf' || fileExtension === 'mp3' || fileExtension === 'mp4') {
            const iv = CryptoJS.lib.WordArray.random(16);
            const encryptedContent = CryptoJS.AES.encrypt(file.content, contextPassword, { iv: iv }).toString();
            encryptedBlob = new Blob([iv.concat(CryptoJS.enc.Base64.parse(encryptedContent))], { type: "application/octet-stream" });
            encryptedFileName = `${file.name}.enc`;
        } else {
            alert(`Unsupported file format: ${fileExtension}`);
            return;
        }

        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(encryptedBlob);
        downloadLink.download = encryptedFileName;
        downloadLink.click();

        downloadLink.addEventListener('click', () => {
            downloadLink.setAttribute('download', encryptedFileName);
            downloadLink.setAttribute('title', 'SecureAES');
            downloadLink.dataset.downloadurl = ['application/octet-stream', downloadLink.download, downloadLink.href].join(':');
        });

        filesProcessed++;
        if (filesProcessed === OnprocessContentFiles.length) {
            encryptButton.textContent = "Save";
            encryptButton.style.backgroundColor = "yellowgreen";
        }
    });

    const logData = OnprocessContentFiles.map(file => ({
        filename: file.name,
        key: contextPassword.toString(CryptoJS.enc.Utf8),
        date: new Date().toISOString(),
    })).concat("\n");

    const logBlob = new Blob([JSON.stringify(logData)], { type: "text/plain" });
    const logFileName = `encryption_log_${new Date().toISOString()}.txt`;

    const logDownloadLink = document.createElement("a");
    logDownloadLink.href = URL.createObjectURL(logBlob);
    logDownloadLink.download = logFileName;
    logDownloadLink.click();

    logDownloadLink.addEventListener('click', () => {
        logDownloadLink.setAttribute('download', logFileName);
        logDownloadLink.setAttribute('title', 'SecureAES');
        logDownloadLink.dataset.downloadurl = ['text/plain', logDownloadLink.download, logDownloadLink.href].join(':');
    });

    const downloadsFolder = `${window.navigator.userAgent.includes("Windows") ? "C:\\Users\\%USERNAME%\\Downloads\\" : "~/Downloads/"}`;
    const logFilePath = `${downloadsFolder}${logFileName}`;

    fetch(logBlob)
        .then(response => response.blob())
        .then(blob => saveAs(blob, logFilePath));

});



decryptButton.addEventListener("click", () => {
    if (!contextPassword) {
        alert("Please enter the password.");
        return;
    }
    if (OnprocessContentFiles.length === 0) {
        alert("Please drop files to decrypt.");
        return;
    }

    let filesProcessed = 0;
    OnprocessContentFiles.forEach((file) => {
        const encryptedContent = CryptoJS.enc.Base64.parse(file.content);
        const iv = encryptedContent.slice(0, 16);
        const encryptedText = encryptedContent.slice(16);
        const decryptedContent = CryptoJS.AES.decrypt({ ciphertext: encryptedText }, contextPassword, { iv: iv });
        const decryptedText = decryptedContent.toString(CryptoJS.enc.Utf8);
        const decryptedBlob = new Blob([decryptedText], { type: "text/plain" });
        const decryptedFileName = file.name.replace(".enc", "");

        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(decryptedBlob);
        downloadLink.download = decryptedFileName;
        downloadLink.click();

        downloadLink.addEventListener('click', () => {
            downloadLink.setAttribute('download', decryptedFileName);
            downloadLink.setAttribute('title', 'SecureAES');
            downloadLink.dataset.downloadurl = ['text/plain', downloadLink.download, downloadLink.href].join(':');
        });

        filesProcessed++;
        if (filesProcessed === OnprocessContentFiles.length) {
            decryptButton.textContent = "Save";
            decryptButton.style.backgroundColor = "yellowgreen";
        }

        decryptedFiles.push({
            name: decryptedFileName,
            status: "decrypted"
        });
    });
    console.log(decryptedFiles);
    OnprocessContentFiles = [];
    contextPassword = null;
    dropZone.innerText = "Drag and Drop your files here";
    dropZone.classList.remove("greenBB");
});





resetButton.addEventListener("click", () => {
    dropZone.classList.remove("greenBB");
    dropZone.classList.remove("hover-Dragover");
    dropZone.innerText = "Drag & Drop Files here"
    OnprocessContentFiles = [];
    decryptedFiles = [];

    passfield.value = "";
    encryptButton.textContent = "Encrypt";
    encryptButton.style.backgroundColor = "";
    decryptButton.textContent = "Decrypt";
    decryptButton.style.backgroundColor = "";
});