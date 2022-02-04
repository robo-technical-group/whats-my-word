/**
 * Game controls
 */

class Game {
    public static readonly MAX_GUESSES: number = 6
    public static readonly WORD_LENGTH: number = 5
    
    public board: GameBoard
    public guess: Guess
    public guessCount: number
    public nextReveal: number
    public revealFinished: boolean
    public resetRequested: boolean

    private _lastRevealed: number
    private _puzzleWord: string

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
        let message: String = "Guess " + this.guessCount++ + " of " + Game.MAX_GUESSES
        let playerInput: string = ""
        let validation: number = this.validateInput(playerInput)
        let reset: boolean = false
        while (validation != GuessStatus.OK && !reset) {
            playerInput = game.askForString(message, Game.WORD_LENGTH) + ""
            console.log("playerInput = " + playerInput + "; length " + playerInput.length)
            if (playerInput == "undefined" || playerInput.length == 0) {
                reset = true
            } else {
                validation = this.validateInput(playerInput)
                switch (validation) {
                    case GuessStatus.WrongLength:
                        game.splash("Guess must be " + Game.WORD_LENGTH + " characters.")
                        break

                    case GuessStatus.NotWord:
                        game.splash(playerInput + " not found in dictionary.")
                        break
                }
            }
        }
        if (reset) {
            this.guessCount--
            this.resetRequested = true
        } else {
            this.resetRequested = false
            this.guess = new Guess(playerInput, this._puzzleWord)
            this.nextReveal = game.runtime()
            this._lastRevealed = -1
            this.revealFinished = false
        }
    }

    public getPuzzle(): string {
        return this._puzzleWord
    }

    public revealNext(): void {
        this._lastRevealed++
        let row: number = this.guessCount - 1
        if (this.guessCount > Game.MAX_GUESSES) {
            row = Game.MAX_GUESSES - 1
        }
        this.board.reveal(row, this._lastRevealed,
            this.guess.guess.charAt(this._lastRevealed),
            this.guess.matches[this._lastRevealed])
        this.nextReveal = game.runtime() + GameBoard.REVEAL_DELAY
        if (this._lastRevealed >= Game.WORD_LENGTH) {
            this.revealFinished = true
        }
    }

    public revealPuzzle(): void {
        game.splash("[Whispers] The password is " + this._puzzleWord + ".")
    }

    public startRound(): void {
        this._puzzleWord = WORDS._pickRandom()
        console.log("[Whispers] The password is " + this._puzzleWord + ".")
        this.guessCount = 0
        this.board.reset()
    }

    private validateInput(input: string): number {
        if (input.length != Game.WORD_LENGTH) {
            return GuessStatus.WrongLength
        }
        if (! this.findInDictionary(input)) {
            return GuessStatus.NotWord
        }

        return GuessStatus.OK
    }
}
