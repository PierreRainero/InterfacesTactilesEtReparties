
# Montre connectée

## Auteur

* [Gaulthier TOUSSAINT](gaulthiertoussaint@gmail.com)

## Installation

Instructions to connect real phone to an android wear emulator and a real wear android :

1. Connect the android phone to computer via USB (allow debugging, ...)
2. Connect the wear android to computer via USB (allow debugging, ...)
3. Create a android wear emulator in Android Studio > AVD Manager
4. Open a command prompt and type 'adb devices'
5. Get the id of each devices
6. Type : 'adb -s &#60;AndroidPhoneId&#62; -d forward tcp:5601 tcp:5601'
7. Open in the android phone the app 'Wear OS' and connect the two wear devices

Connect the debugger to the watch :

adb forward tcp:4444 localabstract:/adb-hub
adb connect 127.0.0.1:4444
