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
let g_game: MainGame = null
let g_stats: Stats = null

/**
 * Main() a.k.a. game.onStart()
 */
startAttractMode()

/**
 * Start game modes
 */
function startGame(): void {
    g_gameMode = GameMode.NotReady
    g_splashScreen.release()
    scene.setBackgroundImage(assets.image`bg`)
    g_stats = new Stats()
    g_game = new MainGame()
    g_game.startRound()
    g_gameMode = GameMode.Main
}   // startGame()

/**
 * Game loops
 */
game.onUpdate(function () {
    switch (g_gameMode) {
        case GameMode.Attract:
            if (game.runtime() >= g_splashScreen.nextTime) {
                g_splashScreen.rotate()
            }   // if (game.runtime() >= g_splashScreen.nextTime)
            break

        case GameMode.Main:
            break

        case GameMode.ShowGuess:
            if (game.runtime() >= g_game.nextReveal) {
                if (! g_game.revealFinished) {
                    revealNextLetter()
                } else {
                    startNextGuess()
                }
            }
            break
    }   // switch (g_gameMode)
})  // game.onUpdate()


/**
 * Other functions
 */
function endGame(win: boolean) {
    if (win) {
        g_stats.addWin(g_game.guessCount)
        game.splash(g_game.getPuzzle() + "!",
        "Got it in " + g_game.guessCount +
            (g_game.guessCount == 1 ? " guess!!" : " guesses!"))
        g_stats.show(g_game.guessCount)
        game.over(true, effects.confetti)
    } else {
        g_stats.addLoss()
        g_stats.show()
        game.over(false, effects.dissolve)
    }
}

function getGuess(): void {
    g_gameMode = GameMode.NotReady
    g_game.getGuess()
    if (g_game.resetRequested) {
        startNextGuess()
    } else {
        // Kludge for GitHub pages version
        // Need to play something to warm up the sound queue
        music.beamUp.playUntilDone()
        g_gameMode = GameMode.ShowGuess
    }
}

function revealNextLetter(): void {
    let status: MatchStatus = g_game.revealNext()
    switch (status) {
        case MatchStatus.Match:
            music.baDing.play()
            break
        
        case MatchStatus.WrongPlace:
            music.smallCrash.play()
            break

        default:
            music.thump.play()
            break
    }
}

function revealWord(): void {
    g_game.revealPuzzle()
    endGame(false)
}

function startNextGuess(): void {
    if (g_game.guess && g_game.guess.numMatches == MainGame.WORD_LENGTH) {
        if (g_game.guessCount <= MainGame.MAX_GUESSES) {
            endGame(true)
        } else {
            endGame(false)
        }
    } else if (g_game.guessCount >= MainGame.MAX_GUESSES) {
        music.wawawawaa.playUntilDone()
        g_game.board.showGiveUpPrompt()
        g_game.board.showWordPrompt()
        g_gameMode = GameMode.Lose
    } else {
        g_game.board.showWordPrompt()
        g_gameMode = GameMode.Main
    }
}


