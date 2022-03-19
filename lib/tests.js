const wordLoader = new WordLoader();

async function test_word_loader(){
    let listOfWords = await wordLoader.execute();
    
    console.assert(listOfWords.includes("abacate"));
    console.assert(listOfWords.includes("abacaxi"));
    console.assert(listOfWords.length==4127);
}

(test_word_loader());

// Test Word Group Manager

async function test_word_group_manager(){
    let listOfWords = await wordLoader.execute();
    let wordGroupManager = new WordGroupManager(listOfWords);

    console.assert(wordGroupManager.nonUsedWords.toString()==listOfWords.toString());
    console.assert(wordGroupManager.usedWords.length==0);

    let word = "abacate";
    wordGroupManager.switchWordFromGroups(word);

    console.assert(wordGroupManager.nonUsedWords.length==listOfWords.length - 1);
    console.assert(wordGroupManager.usedWords.length==1);
}

(test_word_group_manager());

// Test Round Manager

async function test_round_manager(){
    let player = new Player();
    let listOfWords = ["abacate", "abacatada"];
    let wordGroupManager = new WordGroupManager(listOfWords);
    let roundManager = new RoundManager(wordGroupManager, player);

    let currentWord = roundManager.next();
    console.assert(currentWord);
    
    currentWord = roundManager.next();
    currentWord = roundManager.next();
    console.assert(!currentWord);
}

(test_round_manager());

async function test_player(){
    let player = new Player();
    
    console.assert(player.isAlive());
    player.fail();
    player.hit(3);

    console.assert(player.mistakes>0);
    console.assert(player.points==30);
} 

(test_player());

async function test_attempt(){
    let attemptManager = new AttemptManager("abacate");

    console.assert(attemptManager.getEncodedWord()=="*******");
   
    let qntFound = attemptManager.guess("a");

    console.assert(qntFound==3);
    console.assert(attemptManager.getEncodedWord()=="a*a*a**");

    attemptManager.guess("b");
    attemptManager.guess("c");

    attemptManager.guess("t");
    attemptManager.guess("e");

    console.assert(attemptManager.isComplete());
}

(test_attempt());