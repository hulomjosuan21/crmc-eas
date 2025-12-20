import 'package:flutter/material.dart';
import 'color_theme_extension.dart';

extension ThemeContext on BuildContext {
  ThemeData get theme => Theme.of(this);

  TextTheme get text => theme.textTheme;

  ColorsExtension get color => theme.extension<ColorsExtension>()!;

  bool get isDarkMode => theme.brightness == Brightness.dark;
}
