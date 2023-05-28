class Password {

    generatePassword(length = 8) {

        const LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";


        const SPECIAL_CHARACTERS = "!@#$%^&*(){}?><}~";


        const DIGITS = "0123456789";


        const CHARACTER_SETS = [LETTERS, SPECIAL_CHARACTERS, DIGITS];


        let password = "";


        for (let i = 0; i < length; i++) {
            const randomCharSetIndex = Math.floor(Math.random() * CHARACTER_SETS.length);
            const randomCharSet = CHARACTER_SETS[randomCharSetIndex];

            const randomCharIndex = Math.floor(Math.random() * randomCharSet.length);
            const randomChar = randomCharSet[randomCharIndex];
            password += randomChar;
        }

        return password;
    }
}

module.exports = Password;
