import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import 'package:mobile/core/theme/color_theme_extension.dart';
import 'package:mobile/core/theme/theme_context_extensions.dart';
import 'package:mobile/core/theme/theme_service.dart';
import 'package:mobile/core/widget/styled_section_header.dart';

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
    final colors = context.color;
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Settings",
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: colors.foreground,
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [..._buildAppearanceSection(colors)],
        ),
      ),
    );
  }

  Widget _buildTile(String title, IconData icon, ThemeMode value) {
    return RadioListTile<ThemeMode>(
      value: value,
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w400)),
      secondary: Icon(icon, fontWeight: FontWeight.w600),
      controlAffinity: ListTileControlAffinity.trailing,
    );
  }

  List<Widget> _buildAppearanceSection(ColorsExtension colors) {
    return [
      StyledSectionHeader(
        title: "Appearance",
        foregroundColor: colors.foreground,
      ),
      const SizedBox(height: 12),
      RadioGroup<ThemeMode>(
        groupValue: _selectedTheme,
        onChanged: (ThemeMode? newValue) {
          if (newValue != null) {
            setState(() => _selectedTheme = newValue);
            _themeService.updateTheme(newValue);
          }
        },
        child: Container(
          decoration: BoxDecoration(
            color: colors.card,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            children: [
              _buildTile("System", Iconsax.setting_2, ThemeMode.system),
              _buildTile("Light Mode", Iconsax.sun_1, ThemeMode.light),
              _buildTile("Dark Mode", Iconsax.moon, ThemeMode.dark),
            ],
          ),
        ),
      ),
    ];
  }
}
