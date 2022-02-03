// Add your code here
enum Status {
    Match,
    WrongPlace,
    NoMatch
}
class Guess {
    private _guess: string
    public matches: Status[] = []

    constructor(guess: string) {
        this._guess = guess
        this.buildMatches()
    }

    private buildMatches(): void {
        let theLetters: string[] = []
        for (let i: number = 0; i < WORD_LENGTH; i++) {
            this.matches[i] = Status.NoMatch
            theLetters[i] = theWord.charAt(i)
        }

        // Find matches first
        for (let i: number = 0; i < WORD_LENGTH; i++) {
            if (this._guess.charAt(i) == theLetters[i]) {
                this.matches[i] = Status.Match
                theLetters[i] = " "
            }
        }

        // Find wrong places next
        for (let i: number = 0; i < WORD_LENGTH; i++) {
            if (this.matches[i] == Status.NoMatch) {
                for (let j: number = 0; j < WORD_LENGTH; j++) {
                    if (this._guess.charAt(i) == theLetters[j]) {
                        this.matches[i] = Status.WrongPlace
                        theLetters[j] = " "
                        break
                    }
                }
            }
        }

        // The rest stay as NoMatches
    }
}