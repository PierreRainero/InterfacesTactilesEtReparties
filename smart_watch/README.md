Instructions to connect real phone to an android wear emulator and a real wear android :
- Connect the android phone to computer via USB (allow debugging, ...)
- Connect the wear android to computer via USB (allow debugging, ...)
- Create a android wear emulator in Android Studio > AVD Manager
- Open a command prompt and type 'adb devices'
- Get the id of each devices
- Type : 'adb -s <AndroidPhoneId> -d forward tcp:5601 tcp:5601'
- Open in the android phone the app 'Wear OS' and connect the two wear devices