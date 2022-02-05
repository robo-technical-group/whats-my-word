/**
 * Controller event handlers
 */
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    switch (g_gameMode) {
        case GameMode.Attract:
            startGame()
            break

        case GameMode.Lose:
        case GameMode.Main:
            getGuess()
            break
    }   // switch (g_gameMode)
})  // controller.A.onEvent()

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    switch (g_gameMode) {
        case GameMode.Attract:
            startGame()
            break

        case GameMode.Lose:
            g_game.revealPuzzle()
            break
            
        case GameMode.Main:
            break
    }   // switch (g_gameMode)
})  // controller.B.onEvent()

controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    switch (g_gameMode) {
        case GameMode.Attract:
            startGame()
            break

        case GameMode.Main:
            break
    }   // switch (g_gameMode)
})  // controller.down.onEvent()

controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    switch (g_gameMode) {
        case GameMode.Attract:
            startGame()
            break

        case GameMode.Main:
            break
    }   // switch (g_gameMode)
})  // controller.left.onEvent()

controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    switch (g_gameMode) {
        case GameMode.Attract:
            startGame()
            break

        case GameMode.Main:
            break
    }   // switch (g_gameMode)
})  // controller.right.onEvent()

controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    switch (g_gameMode) {
        case GameMode.Attract:
            startGame()
            break

        case GameMode.Main:
            break
    }   // switch (g_gameMode)
})  // controller.up.onEvent()

controller.combos.attachCombo("uuddlrlrba", function () {
    g_stats.show()
    if (game.ask("Reset stats?")) {
        g_stats.reset()
    }
})
