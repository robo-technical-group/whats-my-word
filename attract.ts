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
let g_gameMode: GameMode = GameMode.NotReady
let g_splashScreen: SplashScreens = null

function buildSplashScreen(): void {
    g_splashScreen = new SplashScreens(
        TEXT_TITLES, Color.Yellow,
        TEXT_HEADLINES, Color.Brown,
        TEXT_ACTIONS, Color.LightBlue)
}

function startAttractMode(): void {
    buildSplashScreen()
    g_splashScreen.build()
    g_gameMode = GameMode.Attract
}   // startAttractMode()
