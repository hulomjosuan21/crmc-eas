import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:iconsax/iconsax.dart';
import 'package:mobile/core/theme/color_theme_extension.dart';
import 'package:mobile/core/theme/theme_context_extensions.dart';
import 'package:mobile/core/controllers/nav_controller.dart';

class FloatingNavBar extends StatelessWidget {
  const FloatingNavBar({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = context.color;
    final NavController navCtrl = Get.find<NavController>();

    return Center(
      child: Container(
        padding: const EdgeInsets.all(6),
        decoration: BoxDecoration(
          color: colors.background,
          borderRadius: BorderRadius.circular(30),
          boxShadow: const [
            BoxShadow(
              color: Color.fromRGBO(0, 0, 0, 0.09),
              blurRadius: 12,
              offset: Offset(0, 3),
            ),
          ],
        ),
        child: Obx(
          () => Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              _NavItem(
                icon: Iconsax.home,
                label: "Home",
                isActive: navCtrl.currentIndex.value == 0,
                onTap: () => navCtrl.changeIndex(0),
                colors: colors,
              ),
              const SizedBox(width: 4),
              _NavItem(
                icon: Iconsax.notification,
                label: "Notification",
                isActive: navCtrl.currentIndex.value == 1,
                onTap: () => navCtrl.changeIndex(1),
                colors: colors,
              ),
              const SizedBox(width: 4),
              _NavItem(
                icon: Iconsax.setting_2,
                label: "Settings",
                isActive: navCtrl.currentIndex.value == 2,
                onTap: () => navCtrl.changeIndex(2),
                colors: colors,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isActive;
  final ColorsExtension colors;
  final VoidCallback onTap;

  const _NavItem({
    required this.icon,
    required this.label,
    required this.isActive,
    required this.colors,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: isActive ? colors.primary : Colors.transparent,
          borderRadius: BorderRadius.circular(25),
        ),
        child: AnimatedSize(
          // This makes the expansion/contraction smooth
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                icon,
                size: 22,
                fontWeight: FontWeight.bold,
                color: isActive
                    ? colors.primaryForeground
                    : colors.secondaryForeground,
              ),
              if (isActive) ...[
                const SizedBox(width: 8),
                Text(
                  label,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                    color: colors.primaryForeground,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
