/**
 * Code for attract mode
 */

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

/**
 * Global variables
 */
let __gameMode: GameMode = GameMode.NotReady
let __splashScreen: SplashScreens = null

function buildSplashScreen(): void {
    __splashScreen = new SplashScreens(
        TEXT_TITLES, Color.Yellow,
        TEXT_HEADLINES, Color.Brown,
        TEXT_ACTIONS, Color.LightBlue)
}

function startAttractMode(): void {
    buildSplashScreen()
    __splashScreen.build()
    __gameMode = GameMode.Attract
}   // startAttractMode()
