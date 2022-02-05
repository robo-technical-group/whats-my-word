/**
 * Class for current guess and letter matches
 */

enum MatchStatus {
    Match,
    WrongPlace,
    NoMatch
}

class Guess {
    public guess: string
    public matches: MatchStatus[]
    public numMatches: number

    constructor(guess: string, puzzle: string) {
        this.guess = guess
        this.matches = []
        this.numMatches = 0
        this.buildMatches(puzzle)
    }

    private buildMatches(puzzle: string): void {
        let theLetters: string[] = []
        for (let i: number = 0; i < MainGame.WORD_LENGTH; i++) {
            this.matches[i] = MatchStatus.NoMatch
            theLetters[i] = puzzle.charAt(i)
        }

        let upperGuess: string = this.guess.toUpperCase()
        // Find matches first
        for (let i: number = 0; i < MainGame.WORD_LENGTH; i++) {
            if (upperGuess.charAt(i) == theLetters[i]) {
                this.matches[i] = MatchStatus.Match
                theLetters[i] = " "
                this.numMatches++
            }
        }

        // Find wrong places next
        for (let i: number = 0; i < MainGame.WORD_LENGTH; i++) {
            if (this.matches[i] == MatchStatus.NoMatch) {
                for (let j: number = 0; j < MainGame.WORD_LENGTH; j++) {
                    if (upperGuess.charAt(i) == theLetters[j]) {
                        this.matches[i] = MatchStatus.WrongPlace
                        theLetters[j] = " "
                        break
                    }
                }
            }
        }

        // The rest stay as NoMatches
    }
}