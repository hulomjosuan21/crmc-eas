import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import 'package:mobile/core/theme/color_theme_extension.dart';
import 'package:mobile/core/theme/theme_context_extensions.dart';

class FloatingNavBar extends StatelessWidget {
  const FloatingNavBar({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = context.color;

    return Center(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 6),
        decoration: BoxDecoration(
          color: colors.background,
          borderRadius: BorderRadius.circular(30),
          boxShadow: const [
            BoxShadow(
              color: Color.fromRGBO(0, 0, 0, 0.09),
              blurRadius: 12,
              spreadRadius: 0,
              offset: Offset(0, 3),
            ),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            _NavItem(
              icon: Iconsax.home,
              label: "Home",
              isActive: true,
              colors: colors,
            ),
            const SizedBox(width: 8),
            _NavItem(
              icon: Iconsax.notification,
              label: "Notification",
              isActive: false,
              colors: colors,
            ),
          ],
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

  const _NavItem({
    required this.icon,
    required this.label,
    required this.isActive,
    required this.colors,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: isActive
          ? BoxDecoration(
              color: colors.primary,
              borderRadius: BorderRadius.circular(20),
            )
          : null,
      child: Row(
        children: [
          Icon(
            icon,
            fontWeight: FontWeight.bold,
            color: isActive
                ? colors.primaryForeground
                : colors.secondaryForeground,
          ),
          const SizedBox(width: 8),
          Text(
            label,
            style: TextStyle(
              fontWeight: FontWeight.w600,
              color: isActive
                  ? colors.primaryForeground
                  : colors.secondaryForeground,
            ),
          ),
        ],
      ),
    );
  }
}
