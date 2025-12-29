import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import 'package:mobile/core/providers/student_provider.dart';
import 'package:mobile/core/theme/theme_context_extensions.dart';
import 'package:mobile/screens/home/widget/events_tab.dart';
import 'package:mobile/screens/home/widget/floating_nav_bar.dart';
import 'package:mobile/screens/home/widget/home_header.dart';
import 'package:provider/provider.dart';

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
    _tabController = TabController(length: 2, vsync: this);

    Future.microtask(() {
      if (mounted) {
        context.read<StudentProvider>().loadStudentData("202200611");
      }
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.color;

    return Scaffold(
      backgroundColor: colors.secondary,
      body: Stack(
        children: [
          SafeArea(
            child: Column(
              children: [
                const HomeHeader(),
                Container(
                  color: colors.background,
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
                      Center(child: Text("You Tab Content")),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const Positioned(
            bottom: 30,
            left: 0,
            right: 0,
            child: FloatingNavBar(),
          ),
        ],
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
