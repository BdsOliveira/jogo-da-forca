async function getTextFromUrl(url){
    let response = await fetch(url);
    let fullText = await response.text();
    return fullText.split("\n");
}

class WordLoader{
    async execute(){
        let list = await getTextFromUrl("http://127.0.0.1:5500/lib/palavras.txt");
        return list;
    }
}

class WordGroupManager {
    constructor(words){
        this.usedWords = [];
        this.nonUsedWords = words;
    }

    switchWordFromGroups (word){
        if(this.nonUsedWords.includes(word)){
            this.usedWords.push(word);
            this.nonUsedWords = this.nonUsedWords.filter(currentWord=>word!=currentWord);
        }
    }

    hasNonUsedWords (){
        return this.nonUsedWords.length > 0;
    }

}

class RoundManager {
    constructor(wordGroupManager, player){
        this.wordGroupManager = wordGroupManager;
        this.player = player;
    }

    next(){
        if(this.wordGroupManager.hasNonUsedWords() && this.player.isAlive()) {
            let currentWord = this.wordGroupManager.nonUsedWords[0];
            this.wordGroupManager.switchWordFromGroups(currentWord);
            return currentWord;
        }
        return false;
    }
}

class Player {
    constructor (){
        this.points = 0;
        this.mistakes = 0;
    }

    isAlive(){
        return this.mistakes < 6;
    }

    fail(){
        this.mistakes++;
    }

    hit(times){
        this.points+=(10*times);
    }
}

class AttemptManager {
    constructor(word){
        this.word = word;
        this.letters = [];
        this.listOfChars = Array.from(this.word);
    }

    getEncodedWord(){
        return this.listOfChars.map((currentLetter)=>{
            if(this.letters.includes(currentLetter)){
                return currentLetter;
            }
            return "*";
        }).join("");
    }

    guess (letter){
        if(!this.isComplete() && !this.letters.includes(letter)){
            this.letters.push(letter);
            return this.listOfChars.filter(currentLetter=>letter==currentLetter).length;
        }
        return -1;
    }

    isComplete(){
        return this.getEncodedWord()==this.word;
    }
}

class GameStatus {
    static print(player, attemptManager){
        return document.write(`<h1 style="color: red; text-align: center;">JOGO DA FORCA</h1><br>
        <h2> Palavra atual: ${attemptManager.getEncodedWord()} </h2><br>
        <h3>Jogador: ${player.points} pontos / ${player.mistakes} erros. </h3>`);
    }
}