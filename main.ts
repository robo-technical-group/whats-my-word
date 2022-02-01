/**
 * My JavaScript Game
 * Built on
 * MakeCode Arcade JavaScript Template v. 2.2.2
 * Last update: 26 Aug 2020 ak
 */

/**
 * Enumerations
 */
// Standard palette
enum Color {
    Transparent, // 0
    White, // 1 = RGB(255, 255, 255)
    Red, // 2 = RGB(255, 33, 33)
    Pink, // 3 = RGB(255, 147, 196)
    Orange, // 4 = RGB(255, 129, 53)
    Yellow, // 5 = RGB(255, 246, 9)
    Aqua, // 6 = RGB(36, 156, 163)
    BrightGreen, // 7 = RGB(120, 220, 82)
    Blue, // 8 = RGB(0, 63, 173)
    LightBlue, // 9 = RGB(135, 242, 255)
    Purple, // 10 = RGB(142, 46, 196)
    RoseBouquet, // 11 = RGB(164, 131, 159)
    Wine, // 12 = RGB(92, 64, 108)
    Bone, // 13 = RGB(229, 205, 196)
    Brown, // 14 = RGB(145, 70, 61)
    Black // 15 = RGB(0, 0, 0)
}   // enum Color

// Game modes
enum GameMode {
    Attract,
    Main,
    NotReady,
    Settings
}   // GameMode

/**
 * Constants
 */
const TEXT_HEADLINES: string[][] = [
    ['My Game is', '(C) 20XX'],
    ['Programmed in', 'MakeCode Arcade'],
    ['by', 'Me']
]
const TEXT_ACTIONS: string[][] = [[
    'Left/Right = Action',
    'Up = Action',
    'Down = Action',
    'A = Action',
    'B = Action'
]]
const TEXT_TITLES: string[] = ['My Game', 'in JavaScript']

/**
 * Global variables
 */
let gameMode: GameMode = GameMode.NotReady
let splashScreen: SplashScreens = null

/**
 * Main() a.k.a. game.onStart()
 */
startAttractMode()

/**
 * Start game modes
 */
function startAttractMode(): void {
    buildSplashScreen()
    splashScreen.build()
    gameMode = GameMode.Attract
}   // startAttractMode()

function startGame(): void {
    gameMode = GameMode.NotReady
    splashScreen.release()
    let img: Image = image.create(screen.width, screen.height)
    img.fill(Color.Aqua)
    scene.setBackgroundImage(img)
    gameMode = GameMode.Main
}   // startGame()

/**
 * Game loops
 */
game.onUpdate(function () {
    switch (gameMode) {
        case GameMode.Attract:
            if (game.runtime() >= splashScreen.nextTime) {
                splashScreen.rotate()
            }   // if (game.runtime() >= splash.nextTime)
            break

        case GameMode.Main:
            break
    }   // switch (gameMode)
})  // game.onUpdate()

/**
 * Controller events
 */
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    switch (gameMode) {
        case GameMode.Attract:
            startGame()
            break

        case GameMode.Main:
            break
    }   // switch (gameMode)
})  // controller.A.onEvent()

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    switch (gameMode) {
        case GameMode.Attract:
            startGame()
            break

        case GameMode.Main:
            break
    }   // switch (gameMode)
})  // controller.B.onEvent()

controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    switch (gameMode) {
        case GameMode.Attract:
            startGame()
            break

        case GameMode.Main:
            break
    }   // switch (gameMode)
})  // controller.down.onEvent()

controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    switch (gameMode) {
        case GameMode.Attract:
            startGame()
            break

        case GameMode.Main:
            break
    }   // switch (gameMode)
})  // controller.left.onEvent()

controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    switch (gameMode) {
        case GameMode.Attract:
            startGame()
            break

        case GameMode.Main:
            break
    }   // switch (gameMode)
})  // controller.right.onEvent()

controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    switch (gameMode) {
        case GameMode.Attract:
            startGame()
            break

        case GameMode.Main:
            break
    }   // switch (gameMode)
})  // controller.up.onEvent()

/**
 * Other functions
 */
function buildSplashScreen(): void {
    splashScreen = new SplashScreens(
        TEXT_TITLES, Color.Yellow,
        TEXT_HEADLINES, Color.Brown,
        TEXT_ACTIONS, Color.LightBlue)
}
