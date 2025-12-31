import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/screens/home/home_screen.dart';
import 'package:mobile/core/widget/floating_nav_bar.dart';
import 'package:mobile/core/controllers/nav_controller.dart';
import 'package:mobile/screens/notification/notification_screen.dart';
import 'package:mobile/screens/settings/setting_screen.dart';

class Layout extends StatelessWidget {
  const Layout({super.key});

  @override
  Widget build(BuildContext context) {
    final NavController navCtrl = Get.put(NavController());

    return Scaffold(
      body: Stack(
        children: [
          Obx(
            () => IndexedStack(
              index: navCtrl.currentIndex.value,
              children: const [
                HomeScreen(),
                NotificationScreen(),
                SettingScreen(),
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
