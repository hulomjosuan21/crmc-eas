import 'package:flutter/material.dart';
import 'package:mobile/core/theme/theme_context_extensions.dart';

class Input extends StatelessWidget {
  final TextEditingController? controller;
  final String hint;
  final IconData? icon;
  final bool isPassword;
  final TextInputType? keyboardType;

  const Input({
    super.key,
    this.controller,
    required this.hint,
    this.icon,
    this.isPassword = false,
    this.keyboardType,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.color;

    return TextField(
      controller: controller,
      obscureText: isPassword,
      keyboardType: keyboardType,
      style: TextStyle(color: colors.foreground, fontSize: 14),
      cursorColor: colors.primary,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: TextStyle(
          color: colors.mutedForeground.withValues(alpha: 0.7),
          fontSize: 14,
        ),
        prefixIcon: icon != null
            ? Icon(icon, color: colors.primary, size: 20)
            : null,

        isDense: true,
        filled: true,
        fillColor: colors.muted,

        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(50.0),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(50.0),
          borderSide: BorderSide.none,
        ),

        // focusedBorder: OutlineInputBorder(
        //   borderRadius: BorderRadius.circular(50.0),
        //   borderSide: BorderSide(
        //     color: colors.secondaryForeground.withValues(alpha: 0.5),
        //     width: 1,
        //   ),
        // ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 20,
          vertical: 14,
        ),
      ),
    );
  }
}
