class Stats {
    public wins: number
    public streak: number
    public games: number
    public guesses: number[]

    public constructor() {
        this.load()
    }

    public addLoss(): void {
        this.games++
        this.streak = 0
        this.save()
    }

    public addWin(numGuesses: number): void {
        this.games++
        this.wins++
        this.streak++
        this.guesses[numGuesses - 1]++
        this.save()
    }

    public load(): void {
        this.wins = settings.exists("saved") ? settings.readNumber("wins") : 0
        this.streak = settings.exists("saved") ? settings.readNumber("streak") : 0
        this.games = settings.exists("saved") ? settings.readNumber("games") : 0
        this.guesses = settings.exists("saved")
            ? settings.readNumberArray("guesses")
            : [0, 0, 0, 0, 0, 0]
    }

    public reset(): void {
        this.wins = 0
        this.streak = 0
        this.games = 0
        this.guesses = [0, 0, 0, 0, 0, 0]
        this.save()
    }

    public save(): void {
        settings.writeNumber("saved", 1)
        settings.writeNumber("wins", this.wins)
        settings.writeNumber("streak", this.streak)
        settings.writeNumber("games", this.games)
        settings.writeNumberArray("guesses", this.guesses)
    }

    public show(): void {
        let message: string =
            "Wins: " + this.wins + "\n"
            + "Win streak: " + this.streak + "\n"
            + "Games: " + this.games + "\n"
        if (this.games > 0) {
            message +=
                "Win %: " + Math.round(this.wins / this.games * 100) + "%\n"
                + "Guesses:\n"
            for (let i: number = 0; i < MainGame.MAX_GUESSES; i++) {
                message += (i + 1) + ": " + this.guesses[i]
                    + "(" + Math.round(this.guesses[i] / this.games * 100) + "%)\n"
            }
        }
        game.showLongText(message, DialogLayout.Full)
    }
}
