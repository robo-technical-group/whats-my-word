/**
 * What's My Word?
 * a.k.a. Wordle for MakeCode Arcade
 * Built on
 * MakeCode Arcade JavaScript Template v. 2.2.2
 * Last update: 26 Aug 2020 ak
 */

/**
 * Enumerations
 */
// Standard palette
enum Color {
    Transparent, // 0
    White, // 1 = RGB(255, 255, 255)
    Red, // 2 = RGB(255, 33, 33)
    Pink, // 3 = RGB(255, 147, 196)
    Orange, // 4 = RGB(255, 129, 53)
    Yellow, // 5 = RGB(255, 246, 9)
    Aqua, // 6 = RGB(36, 156, 163)
    BrightGreen, // 7 = RGB(120, 220, 82)
    Blue, // 8 = RGB(0, 63, 173)
    LightBlue, // 9 = RGB(135, 242, 255)
    Purple, // 10 = RGB(142, 46, 196)
    RoseBouquet, // 11 = RGB(164, 131, 159)
    Wine, // 12 = RGB(92, 64, 108)
    Bone, // 13 = RGB(229, 205, 196)
    Brown, // 14 = RGB(145, 70, 61)
    Black // 15 = RGB(0, 0, 0)
}   // enum Color

// Game modes
enum GameMode {
    Attract,
    Lose,
    Main,
    NotReady,
    Settings,
    ShowGuess
}   // GameMode

enum GuessStatus {
    OK,
    WrongLength,
    NotWord
}

/**
 * Constants
 */
const MAX_GUESSES: number = 6
const REVEAL_DELAY: number = 100
const TEXT_HEADLINES: string[][] = [
    ['MakeCode Arcade port of', 'Wordle by Josh Wardle'],
    ['Programmed in', 'MakeCode Arcade'],
    ['by', 'Alex K.']
]
const TEXT_ACTIONS: string[][] = [[
    'Green = Correct place',
    'Yellow = Wrong location',
    'Black = Letter not in word'
]]
const TEXT_TITLES: string[] = ['What\'s My', 'Word?']
const WORD_LENGTH: number = 5

/**
 * Global variables
 */
let currGuess: number = 0
let gameBoard: TextSprite[][] = []
let gameMode: GameMode = GameMode.NotReady
let giveUpSprite: TextSprite = null
let guessWord: string = ""
let lastRevealed: number = -1
let letterBoard: TextSprite[] = []
let nextReveal: number = 0
let numMatches: number = 0
let promptSprite: TextSprite = null
let splashScreen: SplashScreens = null
let theWord: string = ""

/**
 * Main() a.k.a. game.onStart()
 */
startAttractMode()

/**
 * Start game modes
 */
function startAttractMode(): void {
    buildSplashScreen()
    splashScreen.build()
    gameMode = GameMode.Attract
}   // startAttractMode()

function startGame(): void {
    gameMode = GameMode.NotReady
    splashScreen.release()
    let img: Image = image.create(screen.width, screen.height)
    img.fill(Color.Wine)
    scene.setBackgroundImage(img)
    setupBoard()
    resetBoard()
    startRound()
    gameMode = GameMode.Main
}   // startGame()

/**
 * Game loops
 */
game.onUpdate(function () {
    switch (gameMode) {
        case GameMode.Attract:
            if (game.runtime() >= splashScreen.nextTime) {
                splashScreen.rotate()
            }   // if (game.runtime() >= splash.nextTime)
            break

        case GameMode.Main:
            break

        case GameMode.ShowGuess:
            if (game.runtime() >= nextReveal) {
                revealNext()
            }
            break
    }   // switch (gameMode)
})  // game.onUpdate()

/**
 * Controller events
 */
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    switch (gameMode) {
        case GameMode.Attract:
            startGame()
            break

        case GameMode.Lose:
        case GameMode.Main:
            getGuess()
            break
    }   // switch (gameMode)
})  // controller.A.onEvent()

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    switch (gameMode) {
        case GameMode.Attract:
            startGame()
            break

        case GameMode.Main:
            break
    }   // switch (gameMode)
})  // controller.B.onEvent()

controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    switch (gameMode) {
        case GameMode.Attract:
            startGame()
            break

        case GameMode.Main:
            break
    }   // switch (gameMode)
})  // controller.down.onEvent()

controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    switch (gameMode) {
        case GameMode.Attract:
            startGame()
            break

        case GameMode.Main:
            break
    }   // switch (gameMode)
})  // controller.left.onEvent()

controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    switch (gameMode) {
        case GameMode.Attract:
            startGame()
            break

        case GameMode.Main:
            break
    }   // switch (gameMode)
})  // controller.right.onEvent()

controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    switch (gameMode) {
        case GameMode.Attract:
            startGame()
            break

        case GameMode.Main:
            break
    }   // switch (gameMode)
})  // controller.up.onEvent()

/**
 * Other functions
 */
function buildSplashScreen(): void {
    splashScreen = new SplashScreens(
        TEXT_TITLES, Color.Yellow,
        TEXT_HEADLINES, Color.Brown,
        TEXT_ACTIONS, Color.LightBlue)
}

function doesLetterMatch(guess: string, master: string, loc: number): boolean {
    return (master.charAt(loc) == guess.charAt(loc))
}

function findGuess(): boolean {
    // Linear search because WORDS is unsorted. :-(
    guessWord = guessWord.toUpperCase()
    for (let word of WORDS) {
        if (guessWord == word) {
            return true
        }
    }
    return false
}

function getGuess(): void {
    gameMode = GameMode.NotReady
    giveUpSprite.setFlag(SpriteFlag.Invisible, true)
    promptSprite.setFlag(SpriteFlag.Invisible, true)
    currGuess++
    let message: String = "Guess " + (currGuess + 1) + " of " + MAX_GUESSES
    guessWord = ""
    let validation: number = validateGuess()
    let reset: boolean = false
    while (validation != GuessStatus.OK && ! reset) {
        guessWord = game.askForString(message, WORD_LENGTH) + ""
        // console.log("guessWord = " + guessWord + "; length " + guessWord.length)
        if (guessWord == "undefined" || guessWord.length == 0) {
            reset = true
        } else {
            validation = validateGuess()
            switch (validation) {
                case GuessStatus.WrongLength:
                    game.splash("Guess must be " + WORD_LENGTH + " characters.")
                    break

                case GuessStatus.NotWord:
                    game.splash(guessWord + " not found in dictionary.")
                    break
            }
        }
    }
    if (reset) {
        resetGuess()
    } else {
        numMatches = 0
        nextReveal = game.runtime()
        lastRevealed = -1
        gameMode = GameMode.ShowGuess
    }
}

function isLetterFound(needle: string, haystack: string): boolean {
    for (let i: number = 0; i < haystack.length; i++) {
        if (haystack.charAt(i) == needle) {
            return true
        }
    }
    return false
}

function resetBoard(): void {
    for (let word: number = 0; word < MAX_GUESSES; word++) {
        for (let letter: number = 0; letter < WORD_LENGTH; letter++) {
            let letterSprite: TextSprite = gameBoard[word][letter]
            letterSprite.text = " "
            letterSprite.bg = 0
            letterSprite.update()
        }
    }
    promptSprite.setFlag(SpriteFlag.Invisible, false)
}

function resetGuess(): void {
    currGuess--
    startNextGuess()
}

function revealNext(): void {
    lastRevealed++
    if (lastRevealed >= WORD_LENGTH) {
        startNextGuess()
    } else {
        let row: number = currGuess
        if (currGuess >= MAX_GUESSES) {
            row = MAX_GUESSES - 1
        }
        let letterSprite: TextSprite = gameBoard[row][lastRevealed]
        letterSprite.text = guessWord.charAt(lastRevealed)
        let charIndex: number = guessWord.charCodeAt(lastRevealed) - "A".charCodeAt(0)
        let letterBoardSprite: TextSprite = letterBoard[charIndex]
        if (doesLetterMatch(guessWord, theWord, lastRevealed)) {
            letterSprite.bg = Color.BrightGreen
            letterSprite.fg = Color.White
            letterBoardSprite.bg = Color.BrightGreen
            letterBoardSprite.fg = Color.White
            numMatches++
        } else if (isLetterFound(guessWord.charAt(lastRevealed), theWord)) {
            letterSprite.bg = Color.Yellow
            letterSprite.fg = Color.Black
            if (letterBoardSprite.bg == 0) {
                letterBoardSprite.bg = Color.Yellow
                letterBoardSprite.fg = Color.Black
            }
        } else {
            letterSprite.bg = Color.Black
            letterSprite.fg = Color.White
            letterBoardSprite.text = ""
        }
        letterSprite.update()
        letterBoardSprite.update()
        nextReveal = game.runtime() + REVEAL_DELAY
    } 
}

function revealWord(): void {
    game.splash("The password is " + theWord + ".")
    game.over(false, effects.dissolve)
}

function setupBoard(): void {
    // Clear the board
    for (let oldsprite of sprites.allOfKind(SpriteKind.Player)) {
        oldsprite.destroy()
    }

    let titleSprite = new TextSprite("What's My Word?", 0, Color.Yellow,
        8, 1, Color.White, 1, 0, 0, null)
    titleSprite.setKind(SpriteKind.Player)
    titleSprite.setPosition(80, 6)
    titleSprite.setFlag(SpriteFlag.Ghost, true)

    promptSprite = new TextSprite("Press A to make a guess.",
        0, Color.Yellow, 8, 0, 0, 0, 0, 0, null)
    promptSprite.setKind(SpriteKind.Player)
    promptSprite.setPosition(80, 114)
    promptSprite.setFlag(SpriteFlag.Ghost, true)

    giveUpSprite = new TextSprite("Press B to reveal word.",
        0, Color.Yellow, 0, 0, 0, 0, 0, 0, null)
    giveUpSprite.setKind(SpriteKind.Player)
    giveUpSprite.setPosition(80, 104)
    giveUpSprite.setFlag(SpriteFlag.Invisible, true)
    giveUpSprite.setFlag(SpriteFlag.Ghost, true)

    // Build main board
    let y: number = 20
    let x: number = 0
    let letterCode: number = "A".charCodeAt(0)
    for (let word: number = 0; word < MAX_GUESSES; word++) {
        let wordSprites: TextSprite[] = [];
        x = 80 - 6 * (WORD_LENGTH - 1);
        for (let letter: number = 0; letter < WORD_LENGTH; letter++) {
            let letterSprite: TextSprite = new TextSprite(
                String.fromCharCode(letterCode), 0, Color.White, 8, 1, Color.White, 1, 0, 0, null
            )
            letterSprite.setKind(SpriteKind.Player)
            letterSprite.setPosition(x, y)
            letterSprite.setFlag(SpriteFlag.Ghost, true)
            wordSprites.push(letterSprite)
            x += 12;
            letterCode++;
            if (letterCode > "Z".charCodeAt(0)) {
                letterCode = "A".charCodeAt(0)
            }
        }
        gameBoard.push(wordSprites);
        y += 14;
    }

    // Build letter board
    x = 140
    y = 20
    let lbHead: TextSprite = new TextSprite(
        "Letter", 0, Color.Yellow, 5, 0, 0, 0, 0, 0, null)
    lbHead.setKind(SpriteKind.Player)
    lbHead.setPosition(x, y)
    lbHead.setFlag(SpriteFlag.Ghost, true)

    y += 6
    lbHead = new TextSprite(
        "Board", 0, Color.Yellow, 5, 0, 0, 0, 0, 0, null)
    lbHead.setKind(SpriteKind.Player)
    lbHead.setPosition(x, y)
    lbHead.setFlag(SpriteFlag.Ghost, true)

    x = 126
    for (let i: number = 0; i < 26; i++) {
        if (i % 5 == 0) {
            x = 126
            y += 7
        }
        let letterSprite: TextSprite = new TextSprite(
            String.fromCharCode("A".charCodeAt(0) + i),
            0, Color.White, 5, 0, 0, 1, 0, 0, null)
        letterSprite.setKind(SpriteKind.Player)
        letterSprite.setPosition(x, y)
        letterSprite.setFlag(SpriteFlag.Ghost, true)
        letterBoard.push(letterSprite)
        x += 7
     }
}

function startNextGuess(): void {
    if (numMatches == WORD_LENGTH) {
        game.splash(theWord + "!", "Got it in " + (currGuess + 1) + 
            (currGuess == 0 ? " guess!!" : " guesses!"))
        if (currGuess < MAX_GUESSES) {
            game.over(true, effects.confetti)
        } else {
            game.over(false, effects.dissolve)
        }
    } else if (currGuess >= MAX_GUESSES - 1) {
        music.wawawawaa.playUntilDone()
        giveUpSprite.setFlag(SpriteFlag.Invisible, false)
        promptSprite.setFlag(SpriteFlag.Invisible, false)
        gameMode = GameMode.Lose
    } else {
        promptSprite.setFlag(SpriteFlag.Invisible, false)
        gameMode = GameMode.Main
    }
}

function startRound(): void {
    theWord = WORDS._pickRandom()
    // console.log("[Whispers] The password is " + theWord + ".")
    currGuess = -1
}

function validateGuess(): number {
    if (guessWord.length != 5) {
        return GuessStatus.WrongLength
    }
    if (! findGuess()) {
        return GuessStatus.NotWord
    }
    return GuessStatus.OK
}