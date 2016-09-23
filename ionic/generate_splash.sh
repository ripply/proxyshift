#!/bin/bash
cordova-splash
cp splash.png resources

cp platforms/android/res/drawable-port-ldpi/screen.png resources/android/splash/drawable-port-ldpi-screen.png
cp platforms/android/res/drawable-port-mdpi/screen.png resources/android/splash/drawable-port-mdpi-screen.png
cp platforms/android/res/drawable-port-hdpi/screen.png resources/android/splash/drawable-port-hdpi-screen.png
cp platforms/android/res/drawable-port-xhdpi/screen.png resources/android/splash/drawable-port-xhdpi-screen.png
cp platforms/android/res/drawable-port-xxhdpi/screen.png resources/android/splash/drawable-port-xxhdpi-screen.png
cp platforms/android/res/drawable-port-xxxhdpi/screen.png resources/android/splash/drawable-port-xxxhdpi-screen.png

cp platforms/android/res/drawable-land-ldpi/screen.png resources/android/splash/drawable-land-ldpi-screen.png
cp platforms/android/res/drawable-land-mdpi/screen.png resources/android/splash/drawable-land-mdpi-screen.png
cp platforms/android/res/drawable-land-hdpi/screen.png resources/android/splash/drawable-land-hdpi-screen.png
cp platforms/android/res/drawable-land-xhdpi/screen.png resources/android/splash/drawable-land-xhdpi-screen.png
cp platforms/android/res/drawable-land-xxhdpi/screen.png resources/android/splash/drawable-land-xxhdpi-screen.png
cp platforms/android/res/drawable-land-xxxhdpi/screen.png resources/android/splash/drawable-land-xxxhdpi-screen.png

cp platforms/ios/Proxy\ Shift/Images.xcassets/LaunchImage.launchimage/* resources/ios/splash
echo "Copied"
