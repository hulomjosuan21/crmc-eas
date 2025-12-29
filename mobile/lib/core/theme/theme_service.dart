import 'package:flutter/material.dart';
import 'package:get_storage/get_storage.dart';
import 'package:get/get.dart';

class ThemeService {
  final _box = GetStorage();
  final _key = 'theme';

  ThemeMode get themeMode {
    final String? theme = _box.read(_key);
    switch (theme) {
      case 'light':
        return ThemeMode.light;
      case 'dark':
        return ThemeMode.dark;
      default:
        return ThemeMode.system;
    }
  }

  void updateTheme(ThemeMode mode) {
    _box.write(_key, mode.name);
    Get.changeThemeMode(mode);
  }
}
