import 'package:flutter/material.dart';
import 'package:mobile/core/theme/theme_context_extensions.dart';

class NotificationScreen extends StatelessWidget {
  const NotificationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = context.color;
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Notifications",
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: colors.foreground,
          ),
        ),
        centerTitle: true,
      ),
      body: const Center(child: Text("No notifications available.")),
    );
  }
}
