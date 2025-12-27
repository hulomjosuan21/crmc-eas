import 'package:flutter/material.dart' hide Theme;
import 'package:mobile/core/theme/app_theme.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:mobile/screens/home.dart';

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: AppTheme.lightTheme,

      darkTheme: AppTheme.darkTheme,

      themeMode: ThemeMode.system,
      title: "School-EAS",
      home: const HomeScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

Future<void> main() async {
  await dotenv.load(fileName: ".env.local");
  runApp(const App());
}
