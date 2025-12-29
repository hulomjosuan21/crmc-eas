import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import 'package:mobile/core/theme/theme_service.dart';

class SettingScreen extends StatefulWidget {
  const SettingScreen({super.key});

  @override
  State<SettingScreen> createState() => _SettingScreenState();
}

class _SettingScreenState extends State<SettingScreen> {
  final _themeService = ThemeService();
  late ThemeMode _selectedTheme;

  @override
  void initState() {
    super.initState();
    _selectedTheme = _themeService.themeMode;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Settings")),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Appearance",
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            RadioGroup<ThemeMode>(
              groupValue: _selectedTheme,
              onChanged: (ThemeMode? newValue) {
                if (newValue != null) {
                  setState(() => _selectedTheme = newValue);
                  _themeService.updateTheme(newValue); // Persist and Change
                }
              },
              child: Container(
                decoration: BoxDecoration(
                  color: Theme.of(context).cardColor,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: Theme.of(
                      context,
                    ).dividerColor.withValues(alpha: 0.1),
                  ),
                ),
                child: Column(
                  children: [
                    _buildTile("System", Iconsax.setting_2, ThemeMode.system),
                    const Divider(height: 1),
                    _buildTile("Light Mode", Iconsax.sun_1, ThemeMode.light),
                    const Divider(height: 1),
                    _buildTile("Dark Mode", Iconsax.moon, ThemeMode.dark),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTile(String title, IconData icon, ThemeMode value) {
    return RadioListTile<ThemeMode>(
      value: value,
      title: Text(title),
      secondary: Icon(icon),
      controlAffinity: ListTileControlAffinity.trailing,
    );
  }
}
