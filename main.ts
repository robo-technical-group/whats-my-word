/**
 * What's My Word?
 * a.k.a. Wordle for MakeCode Arcade
 * https://www.powerlanguage.co.uk/wordle/
 * Built on
 * MakeCode Arcade JavaScript Template v. 3.0.0
 * Template last update: 04 Feb 2022 ak
 */

/**
 * Constants
 */

/**
 * Global variables
 */
let __game: Game = null
let __stats: Stats = null

/**
 * Main() a.k.a. game.onStart()
 */
startAttractMode()

/**
 * Start game modes
 */
function startGame(): void {
    __gameMode = GameMode.NotReady
    __splashScreen.release()
    scene.setBackgroundImage(assets.image`bg`)
    __stats = new Stats()
    __game = new Game()
    __game.startRound()
    __gameMode = GameMode.Main
}   // startGame()

/**
 * Game loops
 */
game.onUpdate(function () {
    switch (__gameMode) {
        case GameMode.Attract:
            if (game.runtime() >= __splashScreen.nextTime) {
                __splashScreen.rotate()
            }   // if (game.runtime() >= __splashScreen.nextTime)
            break

        case GameMode.Main:
            break

        case GameMode.ShowGuess:
            if (game.runtime() >= __game.nextReveal) {
                __game.revealNext()
                if (__game.revealFinished) {
                    startNextGuess()
                }
            }
            break
    }   // switch (__gameMode)
})  // game.onUpdate()


/**
 * Other functions
 */
function endGame(win: boolean) {
    if (win) {
        __stats.addWin(__game.guessCount)
        game.splash(__game.getPuzzle() + "!",
        "Got it in " + __game.guessCount +
            (__game.guessCount == 1 ? " guess!!" : " guesses!"))
        __stats.show()
        game.over(true, effects.confetti)
    } else {
        __stats.addLoss()
        __stats.show()
        game.over(false, effects.dissolve)
    }
}

function getGuess(): void {
    __gameMode = GameMode.NotReady
    __game.getGuess()
    if (__game.resetRequested) {
        startNextGuess()
    } else {
        __gameMode = GameMode.ShowGuess
    }
}

function revealWord(): void {
    __game.revealPuzzle()
    endGame(false)
}

function startNextGuess(): void {
    if (__game.guess.numMatches == Game.WORD_LENGTH) {
        if (__game.guessCount <= Game.MAX_GUESSES) {
            endGame(true)
        } else {
            endGame(false)
        }
    } else if (__game.guessCount >= Game.MAX_GUESSES) {
        music.wawawawaa.playUntilDone()
        __game.board.showGiveUpPrompt()
        __game.board.showWordPrompt()
        __gameMode = GameMode.Lose
    } else {
        __game.board.showWordPrompt()
        __gameMode = GameMode.Main
    }
}


