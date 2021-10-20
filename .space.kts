/**
* JetBrains Space Automation
* This Kotlin-script file lets you automate build activities
* For more info, see https://www.jetbrains.com/help/space/automation.html
*/

job("Build and publish frontend") {
    container(displayName = "Alpine build environment", image = "alpine") {
        shellScript {
            content = """
                apk add yarn
                yarn
                yarn run build
            """
        }
    }
}
