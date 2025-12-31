import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:iconsax/iconsax.dart';
import 'package:mobile/core/providers/student_provider.dart';
import 'package:mobile/core/theme/theme_context_extensions.dart';
import 'package:mobile/core/widget/auto_clear_avatar.dart';
import 'package:provider/provider.dart';

class HomeAppBar extends StatelessWidget implements PreferredSizeWidget {
  const HomeAppBar({super.key});

  @override
  Size get preferredSize => const Size.fromHeight(160);

  @override
  Widget build(BuildContext context) {
    final studentProvider = context.watch<StudentProvider>();
    final student = studentProvider.student;
    final colors = context.color;

    return AppBar(
      backgroundColor: colors.background,
      elevation: 0,
      scrolledUnderElevation: 0,
      automaticallyImplyLeading: false,

      flexibleSpace: SafeArea(
        child: Column(
          children: [
            Container(
              height: 56,
              decoration: BoxDecoration(
                border: Border(
                  bottom: BorderSide(color: colors.border, width: 1),
                ),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: Row(
                children: [
                  const SizedBox(width: 8),
                  InkWell(
                    borderRadius: BorderRadius.circular(6),
                    onTap: () => _showAccountMenu(context),
                    child: Row(
                      children: [
                        Text(
                          "ID: ${student?.studentSchoolId ?? "----"}",
                          style: TextStyle(
                            color: colors.foreground,
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                            letterSpacing: -0.5,
                          ),
                        ),
                        const SizedBox(width: 4),
                        const Icon(
                          Iconsax.arrow_down_1,
                          size: 18,
                          fontWeight: FontWeight.w600,
                        ),
                      ],
                    ),
                  ),
                  const Spacer(),
                  IconButton(
                    onPressed: () =>
                        Navigator.pushNamed(context, '/search/josuan'),
                    icon: Icon(
                      Iconsax.search_normal,
                      color: colors.foreground,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),

            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: [
                    AutoClearAvatar(
                      imageUrl: 'https://i.pravatar.cc/150?img=11',
                      colors: colors,
                    ),
                    const SizedBox(width: 16),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          "${student?.firstName} ${student?.lastName ?? ''}",
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                            color: colors.foreground,
                          ),
                          overflow: TextOverflow.fade,
                          maxLines: 2,
                        ),
                        Text(
                          "BSIT Student",
                          style: TextStyle(
                            color: colors.mutedForeground,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showAccountMenu(BuildContext context) {
    final colors = context.color;
    final studentProvider = context.read<StudentProvider>();

    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(15)),
      ),
      builder: (context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: Icon(
                  Iconsax.logout,
                  color: colors.destructive,
                  fontWeight: FontWeight.w500,
                ),
                title: Text(
                  'Sign Out',
                  style: TextStyle(color: colors.destructive),
                ),
                onTap: () async {
                  Navigator.pop(context);
                  await studentProvider.logout();
                  Get.offAllNamed('/signin');
                },
              ),
            ],
          ),
        );
      },
    );
  }
}
