/**
* JetBrains Space Automation
* This Kotlin-script file lets you automate build activities
* For more info, see https://www.jetbrains.com/help/space/automation.html
*/

job("Build and publish frontend") {
    container(displayName = "Ubuntu build environment", image = "ubuntu:bionic") {
        shellScript {
            content = "ls -a"
        }
    }
}
