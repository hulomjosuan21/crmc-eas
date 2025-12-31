import 'package:flutter/material.dart';
import 'package:mobile/core/theme/theme_context_extensions.dart';
import 'package:mobile/core/widget/button.dart';
import 'package:mobile/core/widget/input.dart';

class QuickAuthView extends StatelessWidget {
  final String? cachedName;
  final TextEditingController idController;
  final bool isLoading;
  final bool rememberMe;
  final ValueChanged<bool?> onRememberMeChanged;
  final VoidCallback onManualAuth;
  final VoidCallback onBiometricAuth;
  final VoidCallback onSwitchAccount;

  const QuickAuthView({
    super.key,
    required this.cachedName,
    required this.idController,
    required this.isLoading,
    required this.rememberMe,
    required this.onRememberMeChanged,
    required this.onManualAuth,
    required this.onBiometricAuth,
    required this.onSwitchAccount,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.color;

    return LayoutBuilder(
      builder: (context, constraints) {
        return SingleChildScrollView(
          child: ConstrainedBox(
            constraints: BoxConstraints(minHeight: constraints.maxHeight),
            child: IntrinsicHeight(
              child: Column(
                children: [
                  // Helper Icon
                  Align(
                    alignment: Alignment.topRight,
                    child: Icon(Icons.help_outline, color: colors.foreground),
                  ),

                  const Spacer(flex: 2),

                  // Header Section
                  Text(
                    "School-EAS",
                    style: TextStyle(
                      fontSize: 40,
                      fontWeight: FontWeight.bold,
                      color: colors.primary,
                      letterSpacing: -1,
                    ),
                  ),
                  const SizedBox(height: 30),

                  // Greeting
                  Text(
                    "Hi, ${cachedName ?? 'Student'}!",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: colors.foreground,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    "Welcome back",
                    style: TextStyle(
                      fontSize: 14,
                      color: colors.mutedForeground,
                      letterSpacing: 0.5,
                    ),
                  ),

                  const SizedBox(height: 30),

                  Input(
                    controller: idController,
                    hint: "Enter School ID",
                    icon: Icons.badge,
                  ),

                  const SizedBox(height: 16),

                  Button.primary(
                    label: "Verify Identity",
                    fullWidth: true,
                    isLoading: isLoading,
                    onPressed: onManualAuth,
                  ),

                  const SizedBox(height: 20),

                  const Row(
                    children: [
                      Expanded(child: Divider()),
                      Padding(
                        padding: EdgeInsets.symmetric(horizontal: 10),
                        child: Text("OR"),
                      ),
                      Expanded(child: Divider()),
                    ],
                  ),

                  const SizedBox(height: 20),

                  Button.secondary(
                    label: "Sign-in with screen lock",
                    icon: Icons.lock_outline_rounded,
                    size: ButtonSize.sm,
                    onPressed: onBiometricAuth,
                  ),

                  const Spacer(flex: 3),

                  // Switch Account Link
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        "Not you? ",
                        style: TextStyle(color: colors.foreground),
                      ),
                      GestureDetector(
                        onTap: onSwitchAccount,
                        child: Text(
                          "Switch account",
                          style: TextStyle(
                            color: colors.primary,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
