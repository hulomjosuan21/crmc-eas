import 'package:flutter/material.dart';
import 'color_palette.dart';
import 'color_theme_extension.dart';

class AppTheme {
  // --- Light Theme ---
  static final ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    fontFamily: 'Inter', // Ensure you have this font or remove this line
    brightness: Brightness.light,
    scaffoldBackgroundColor: ColorPalette.white,

    // Inject our Custom Extension
    extensions: [ColorsExtension.light],

    // Global Icon Theme
    iconTheme: const IconThemeData(color: ColorPalette.neutral900),

    // Global Text Theme
    textTheme: ThemeData.light().textTheme.apply(
      bodyColor: ColorPalette.neutral950,
      displayColor: ColorPalette.neutral950,
    ),

    // Standard Material ColorScheme (mapped for backward compatibility)
    colorScheme: const ColorScheme.light(
      surface: ColorPalette.white,
      onSurface: ColorPalette.neutral950,
      primary: ColorPalette.primary,
      onPrimary: ColorPalette.white,
      secondary: ColorPalette.neutral100,
      onSecondary: ColorPalette.neutral900,
      error: ColorPalette.red500,
      onError: ColorPalette.white,
    ),

    appBarTheme: const AppBarTheme(
      backgroundColor: ColorPalette.white,
      foregroundColor: ColorPalette.neutral950,
      elevation: 0,
      scrolledUnderElevation: 0,
      centerTitle: false,
      surfaceTintColor: Colors.transparent, // Prevents tinting
    ),
  );

  // --- Dark Theme ---
  static final ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    fontFamily: 'Inter',
    brightness: Brightness.dark,
    scaffoldBackgroundColor: ColorPalette.neutral950,

    // Inject our Custom Extension
    extensions: [ColorsExtension.dark],

    // Global Icon Theme
    iconTheme: const IconThemeData(color: ColorPalette.neutral50),

    // Global Text Theme
    textTheme: ThemeData.dark().textTheme.apply(
      bodyColor: ColorPalette.neutral50,
      displayColor: ColorPalette.neutral50,
    ),

    // Standard Material ColorScheme
    colorScheme: const ColorScheme.dark(
      surface: ColorPalette.neutral950,
      onSurface: ColorPalette.neutral50,
      primary: ColorPalette.primary,
      onPrimary: ColorPalette.white, // White text on Blue button looks best
      secondary: ColorPalette.neutral800,
      onSecondary: ColorPalette.neutral50,
      error: ColorPalette.red600,
      onError: ColorPalette.neutral50,
    ),

    appBarTheme: const AppBarTheme(
      backgroundColor: ColorPalette.neutral950,
      foregroundColor: ColorPalette.neutral50,
      elevation: 0,
      scrolledUnderElevation: 0,
      centerTitle: false,
      surfaceTintColor: Colors.transparent, // CRITICAL: No Blue Tint
    ),
  );
}
