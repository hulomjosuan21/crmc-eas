import 'package:flutter/material.dart';
import 'color_palette.dart';
import 'color_theme_extension.dart';

class AppTheme {
  static final ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    fontFamily: 'GoogleSans',
    brightness: Brightness.light,
    scaffoldBackgroundColor: ColorPalette.white,
    extensions: [ColorsExtension.light],

    iconTheme: const IconThemeData(color: ColorPalette.neutral900),

    textTheme: ThemeData.light().textTheme.apply(
      fontFamily: 'GoogleSans',
      bodyColor: ColorPalette.neutral950,
      displayColor: ColorPalette.neutral950,
    ),

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
      surfaceTintColor: Colors.transparent,
    ),
  );

  static final ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    fontFamily: 'GoogleSans',
    brightness: Brightness.dark,
    scaffoldBackgroundColor: ColorPalette.neutral950,

    extensions: [ColorsExtension.dark],

    iconTheme: const IconThemeData(color: ColorPalette.neutral50),

    textTheme: ThemeData.dark().textTheme.apply(
      fontFamily: 'GoogleSans',
      bodyColor: ColorPalette.neutral50,
      displayColor: ColorPalette.neutral50,
    ),

    colorScheme: const ColorScheme.dark(
      surface: ColorPalette.neutral950,
      onSurface: ColorPalette.neutral50,
      primary: ColorPalette.primary,
      onPrimary: ColorPalette.white,
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
      surfaceTintColor: Colors.transparent,
    ),
  );
}
