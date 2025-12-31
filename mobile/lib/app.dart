import 'package:flutter/material.dart' hide Theme;
import 'package:get_storage/get_storage.dart';
import 'package:mobile/core/providers/student_provider.dart';
import 'package:mobile/core/theme/app_theme.dart';
import 'package:mobile/core/theme/theme_service.dart';
import 'package:mobile/layout.dart';
import 'package:get/get.dart';
import 'package:mobile/screens/auth/student_auth_screen.dart';
import 'package:mobile/screens/search/search_result_screen.dart';
import 'package:provider/provider.dart';
import 'package:toastification/toastification.dart';

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
      if (!mounted) return;

      final storage = GetStorage();
      final String? savedId = storage.read('last_school_id');
      final bool stayLoggedIn = storage.read('stay_logged_in') ?? false;

      if (stayLoggedIn && savedId != null) {
        context.read<StudentProvider>().loadStudentData(savedId);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final storage = GetStorage();
    final bool stayLoggedIn = storage.read('stay_logged_in') ?? false;
    final String? savedId = storage.read('last_school_id');

    String initialRoute = (stayLoggedIn && savedId != null) ? '/' : '/signin';

    return ToastificationWrapper(
      child: GetMaterialApp(
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: ThemeService().themeMode,
        title: "School-EAS",
        initialRoute: initialRoute,
        getPages: [
          GetPage(
            name: '/signin',
            page: () => const StudentAuthScreen(),
            transition: Transition.fadeIn,
          ),
          GetPage(
            name: '/',
            page: () => const Layout(),
            transition: Transition.fadeIn,
          ),
          GetPage(
            name: '/search/:query',
            page: () => const SearchResultScreen(),
            transition: Transition.fadeIn,
          ),
        ],
        unknownRoute: GetPage(
          name: '/not-found',
          page: () =>
              const Scaffold(body: Center(child: Text("Page not found"))),
        ),
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}
