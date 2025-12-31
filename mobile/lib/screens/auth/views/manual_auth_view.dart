import 'package:flutter/material.dart';
import 'package:mobile/core/theme/theme_context_extensions.dart';
import 'package:mobile/core/widget/button.dart';
import 'package:mobile/core/widget/input.dart';

class ManualAuthView extends StatelessWidget {
  final TextEditingController idController;
  final bool isLoading;
  final bool rememberMe;
  final ValueChanged<bool?> onRememberMeChanged;
  final VoidCallback onManualAuth;
  final bool canCheckBiometrics;
  final bool hasCachedId;
  final VoidCallback onBackToQuickAuth;

  const ManualAuthView({
    super.key,
    required this.idController,
    required this.isLoading,
    required this.rememberMe,
    required this.onRememberMeChanged,
    required this.onManualAuth,
    required this.canCheckBiometrics,
    required this.hasCachedId,
    required this.onBackToQuickAuth,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.color;

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(Icons.school, size: 60, color: colors.primary),
        const SizedBox(height: 40),

        Text(
          "Student Verification",
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: colors.foreground,
          ),
        ),
        const SizedBox(height: 30),

        Input(
          controller: idController,
          hint: "Enter School ID",
          icon: Icons.badge,
        ),
        const SizedBox(height: 16),

        Theme(
          data: ThemeData(
            checkboxTheme: CheckboxThemeData(
              fillColor: WidgetStateProperty.resolveWith(
                (states) => states.contains(WidgetState.selected)
                    ? colors.primary
                    : colors.muted,
              ),
            ),
          ),
          child: CheckboxListTile(
            title: Text(
              "Keep me signed in",
              style: TextStyle(color: colors.foreground),
            ),
            value: rememberMe,
            contentPadding: EdgeInsets.zero,
            controlAffinity: ListTileControlAffinity.leading,
            checkColor: colors.primaryForeground,
            onChanged: onRememberMeChanged,
          ),
        ),

        const SizedBox(height: 20),

        Button.primary(
          label: "Verify Identity",
          fullWidth: true,
          isLoading: isLoading,
          onPressed: onManualAuth,
        ),

        if (hasCachedId && canCheckBiometrics) ...[
          const SizedBox(height: 20),
          GestureDetector(
            onTap: onBackToQuickAuth,
            child: Text(
              "Back to Quick Auth",
              style: TextStyle(
                color: colors.primary,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ],
    );
  }
}
