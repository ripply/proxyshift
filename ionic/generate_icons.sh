#!/bin/bash
cordova-icon
cp icon.png resources
cp platforms/android/res/drawable-mdpi/icon.png resources/android/icon/drawable-mdpi.png
cp platforms/android/res/drawable-hdpi/icon.png resources/android/icon/drawable-hdpi.png
cp platforms/android/res/drawable/icon.png resources/android/icon/drawable.png
cp platforms/android/res/drawable-ldpi/icon.png resources/android/icon/drawable-ldpi.png
cp platforms/android/res/drawable-xhdpi/icon.png resources/android/icon/drawable-xhdpi.png
cp platforms/android/res/drawable-xxhdpi/icon.png resources/android/icon/drawable-xxhdpi.png
cp platforms/android/res/drawable-xxxhdpi/icon.png resources/android/icon/drawable-xxxhdpi.png

cp platforms/ios/Proxy\ Shift/Images.xcassets/AppIcon.appiconset/*.png resources/ios/icon
echo "Copied"
