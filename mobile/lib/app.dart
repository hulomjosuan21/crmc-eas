import 'package:flutter/material.dart' hide Theme;
import 'package:get/get_navigation/src/root/get_material_app.dart';
import 'package:mobile/core/providers/student_provider.dart';
import 'package:mobile/core/theme/app_theme.dart';
import 'package:mobile/core/theme/theme_service.dart';
import 'package:mobile/layout.dart';
import 'package:get/get.dart';
import 'package:mobile/screens/search/search_result_screen.dart';
import 'package:provider/provider.dart';

class App extends StatefulWidget {
  const App({super.key});

  @override
  State<App> createState() => _AppState();
}

class _AppState extends State<App> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      if (mounted) {
        context.read<StudentProvider>().loadStudentData("202200611");
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeService().themeMode,
      title: "School-EAS",
      initialRoute: '/',
      getPages: [
        GetPage(
          name: '/',
          page: () => const Layout(),
          transition: Transition.fadeIn,
        ),
        GetPage(name: '/search/:query', page: () => const SearchResultScreen()),
      ],
      unknownRoute: GetPage(
        name: '/not-found',
        page: () => const Scaffold(body: Center(child: Text("Page not found"))),
      ),
      debugShowCheckedModeBanner: false,
    );
  }
}
