/**
 * Game controls
 */

class MainGame {
    public static readonly MAX_GUESSES: number = 6
    public static readonly WORD_LENGTH: number = 5
    
    public board: GameBoard
    public guess: Guess
    public guessCount: number
    public nextReveal: number
    public revealFinished: boolean
    public resetRequested: boolean

    private lastRevealed: number
    private puzzleWord: string

    public constructor() {
        this.board = new GameBoard()
        this.nextReveal = 0
        this.resetRequested = false
        this.revealFinished = true
    }

    public findInDictionary(needle: string): boolean {
        // Linear search because WORDS is unsorted. :-(
        needle = needle.toUpperCase()
        for (let word of WORDS) {
            if (needle == word) {
                return true
            }
        }
        return false
    }

    public getGuess(): void {
        this.board.hideGiveUpPrompt()
        this.board.hideWordPrompt()
        this.guessCount++
        let message: String = "Guess " + this.guessCount + " of " + MainGame.MAX_GUESSES
        let playerInput: string = ""
        let validation: number = this.validateInput(playerInput)
        let reset: boolean = false
        while (validation != GuessStatus.OK && !reset) {
            playerInput = game.askForString(message, MainGame.WORD_LENGTH) + ""
            // console.log("playerInput = " + playerInput + "; length " + playerInput.length)
            if (playerInput == "undefined" || playerInput.length == 0) {
                reset = true
            } else {
                validation = this.validateInput(playerInput)
                switch (validation) {
                    case GuessStatus.WrongLength:
                        game.splash("Guess must be " + MainGame.WORD_LENGTH + " characters.")
                        break

                    case GuessStatus.NotWord:
                        game.splash(playerInput.toUpperCase() + " not found in dictionary.")
                        break
                }
            }
        }
        if (reset) {
            this.guessCount--
            this.resetRequested = true
        } else {
            // console.log("Guess #" + this.guessCount + ": " + playerInput)
            this.resetRequested = false
            this.guess = new Guess(playerInput, this.puzzleWord)
            this.nextReveal = game.runtime()
            this.lastRevealed = -1
            this.revealFinished = false
        }
    }

    public getPuzzle(): string {
        return this.puzzleWord
    }

    public revealNext(): MatchStatus {
        this.lastRevealed++
        let row: number = this.guessCount - 1
        if (this.guessCount > MainGame.MAX_GUESSES) {
            row = MainGame.MAX_GUESSES - 1
        }
        this.board.reveal(row, this.lastRevealed,
            this.guess.guess.charAt(this.lastRevealed),
            this.guess.matches[this.lastRevealed])
        this.nextReveal = game.runtime() + GameBoard.REVEAL_DELAY
        if (this.lastRevealed >= MainGame.WORD_LENGTH - 1) {
            this.revealFinished = true
        }
        return this.guess.matches[this.lastRevealed]
    }

    public revealPuzzle(): void {
        game.splash("[Whispers] The password is " + this.puzzleWord + ".")
    }

    public startRound(): void {
        this.puzzleWord = WORDS._pickRandom()
        // console.log("[Whispers] The password is " + this.puzzleWord + ".")
        this.guessCount = 0
        this.board.reset()
    }

    private validateInput(input: string): number {
        if (input.length != MainGame.WORD_LENGTH) {
            return GuessStatus.WrongLength
        }
        if (! this.findInDictionary(input)) {
            return GuessStatus.NotWord
        }

        return GuessStatus.OK
    }
}
