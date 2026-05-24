# React Native core — JNI bridge uses reflection
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-dontwarn com.facebook.react.**
-dontwarn com.facebook.hermes.**

# react-native-config — reads BuildConfig fields via reflection
-keep class com.lugg.RNCConfig.** { *; }

# Keep native methods
-keepclassmembers class * {
    native <methods>;
}

# Keep JS-annotated React props
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
}
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>;
}
