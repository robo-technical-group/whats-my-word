/**
 * Game board
 */

class GameBoard {
    public static readonly REVEAL_DELAY: number = 500

    private gameBoard: TextSprite[][]
    private giveUpSprite: TextSprite
    private letterBoard: TextSprite[]
    private promptSprite: TextSprite
    private titleSprite: TextSprite

    public constructor() {
        this.delete()

        this.gameBoard = []
        this.letterBoard = []
        this.createTitles()
        this.createGameBoard()
        this.createLetterBoard()
    }

    public hideGiveUpPrompt(): void {
        this.giveUpSprite.setFlag(SpriteFlag.Invisible, true)
    }

    public hideWordPrompt(): void {
        this.promptSprite.setFlag(SpriteFlag.Invisible, true)
    }

    public reveal(row: number, col: number, letter: string, status: MatchStatus) : void {
        let letterSprite: TextSprite = this.gameBoard[row][col]
        let upperLetter: string = letter.toUpperCase()
        letterSprite.text = upperLetter
        let charIndex: number = upperLetter.charCodeAt(0) - "A".charCodeAt(0)
        let letterBoardSprite: TextSprite = this.letterBoard[charIndex]
        switch (status) {
            case MatchStatus.Match:
                music.baDing.play()
                letterSprite.bg = Color.BrightGreen
                letterSprite.fg = Color.White
                letterBoardSprite.bg = Color.BrightGreen
                letterBoardSprite.fg = Color.White
                break

            case MatchStatus.WrongPlace:
                music.smallCrash.play()
                letterSprite.bg = Color.Yellow
                letterSprite.fg = Color.Black
                if (letterBoardSprite.bg == 0) {
                    letterBoardSprite.bg = Color.Yellow
                    letterBoardSprite.fg = Color.Black
                }
                break

            default:
                music.knock.play()
                letterSprite.bg = Color.Black
                letterSprite.fg = Color.White
                if (letterBoardSprite.bg == 0) {
                    letterBoardSprite.text = ""
                }
                break
        }
        letterSprite.update()
        letterBoardSprite.update()
    }

    public reset(): void {
        for (let word: number = 0; word < MainGame.MAX_GUESSES; word++) {
            for (let letter: number = 0; letter < MainGame.WORD_LENGTH; letter++) {
                let letterSprite: TextSprite = this.gameBoard[word][letter]
                letterSprite.text = " "
                letterSprite.bg = 0
                letterSprite.update()
            }
        }
        this.showWordPrompt()
    }

    public showGiveUpPrompt(): void {
        this.giveUpSprite.setFlag(SpriteFlag.Invisible, false)
    }

    public showWordPrompt(): void {
        this.promptSprite.setFlag(SpriteFlag.Invisible, false)
    }

    private createGameBoard(): void {
        let y: number = 20
        let x: number = 0
        let letterCode: number = "A".charCodeAt(0)
        for (let word: number = 0; word < MainGame.MAX_GUESSES; word++) {
            let wordSprites: TextSprite[] = [];
            x = 80 - 6 * (MainGame.WORD_LENGTH - 1);
            for (let letter: number = 0; letter < MainGame.WORD_LENGTH; letter++) {
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
            this.gameBoard.push(wordSprites);
            y += 14;
        }
    }

    private createLetterBoard(): void {
        let x: number = 140
        let y: number = 20
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
            this.letterBoard.push(letterSprite)
            x += 7
        }
    }

    private createTitles(): void {
        this.titleSprite = new TextSprite("What's My Word?", 0, Color.Yellow,
            8, 1, Color.White, 1, 0, 0, null)
        this.titleSprite.setPosition(80, 6)

        this.promptSprite = new TextSprite("Press A to make a guess.",
            0, Color.Yellow, 8, 0, 0, 0, 0, 0, null)
        this.promptSprite.setPosition(80, 114)

        this.giveUpSprite = new TextSprite("Press B to reveal word.",
            0, Color.Yellow, 0, 0, 0, 0, 0, 0, null)
        this.giveUpSprite.setPosition(80, 104)
        this.giveUpSprite.setFlag(SpriteFlag.Invisible, true)
    }

    private delete(): void {
        // Clear the board
        for (let oldSprite of sprites.allOfKind(SpriteKind.Text)) {
            oldSprite.destroy()
        }
    }
}
