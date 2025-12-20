import 'package:flutter/material.dart' hide Theme;
import 'package:mobile/core/theme/app_theme.dart';
import 'package:mobile/core/theme/theme_extensions.dart';

class Home extends StatelessWidget {
  const Home({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Home", style: TextStyle(color: context.color.primary)),
      ),
      body: Center(child: Text("Click Me!")),
    );
  }
}

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: AppTheme.lightTheme,

      darkTheme: AppTheme.darkTheme,

      themeMode: ThemeMode.system,
      title: "School-EAS",
      home: const Home(),
      debugShowCheckedModeBanner: false,
    );
  }
}

Future<void> main() async {
  runApp(const App());
}
