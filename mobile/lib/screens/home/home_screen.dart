import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:iconsax/iconsax.dart';
import 'package:mobile/core/theme/theme_context_extensions.dart';
import 'package:mobile/screens/home/tabs/events_tab.dart';
import 'package:mobile/screens/home/tabs/qr_tab.dart';
import 'package:mobile/screens/home/widget/home_app_bar.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.color;
    final isDark = ThemeContext(context).isDarkMode;

    return AnnotatedRegion(
      value: SystemUiOverlayStyle(
        systemNavigationBarColor: colors.secondary,
        systemNavigationBarIconBrightness: isDark
            ? Brightness.light
            : Brightness.dark,
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: isDark ? Brightness.light : Brightness.dark,
      ),
      child: Scaffold(
        appBar: HomeAppBar(),
        backgroundColor: colors.secondary,
        body: SafeArea(
          child: Stack(
            children: [
              Column(
                children: [
                  Container(
                    decoration: BoxDecoration(color: colors.background),
                    child: TabBar(
                      controller: _tabController,
                      labelColor: colors.foreground,
                      unselectedLabelColor: colors.mutedForeground,
                      indicatorColor: colors.primary,
                      dividerColor: colors.secondary,
                      indicatorWeight: 3,
                      labelStyle: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                      tabs: const [
                        Tab(
                          child: _TabLabel(
                            icon: Iconsax.calendar_1,
                            text: "Events",
                          ),
                        ),
                        Tab(
                          child: _TabLabel(
                            icon: Iconsax.scan_barcode,
                            text: "QR",
                          ),
                        ),
                        Tab(
                          child: _TabLabel(
                            icon: Iconsax.personalcard,
                            text: "You",
                          ),
                        ),
                      ],
                    ),
                  ),

                  Expanded(
                    child: TabBarView(
                      controller: _tabController,
                      children: const [
                        EventsTab(),
                        QrTab(),
                        Center(child: Text("You Tab Content")),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _TabLabel extends StatelessWidget {
  final IconData icon;
  final String text;
  const _TabLabel({required this.icon, required this.text});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, fontWeight: FontWeight.w600),
        const SizedBox(width: 6),
        Text(text, style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
      ],
    );
  }
}
