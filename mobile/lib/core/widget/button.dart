import 'package:flutter/material.dart';
import 'package:mobile/core/theme/theme_context_extensions.dart';

enum _Variant { primary, secondary, destructive, outline, ghost }

enum ButtonIconPosition { leading, trailing }

class Button extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final _Variant _variant;

  final bool isLoading;
  final String? loadingLabel;
  final IconData? icon;
  final ButtonIconPosition iconPosition;

  // 1. Add the fullWidth property
  final bool fullWidth;

  const Button.primary({
    super.key,
    required this.label,
    required this.onPressed,
    this.isLoading = false,
    this.loadingLabel,
    this.icon,
    this.iconPosition = ButtonIconPosition.leading,
    this.fullWidth = false,
  }) : _variant = _Variant.primary;

  const Button.secondary({
    super.key,
    required this.label,
    required this.onPressed,
    this.isLoading = false,
    this.loadingLabel,
    this.icon,
    this.iconPosition = ButtonIconPosition.leading,
    this.fullWidth = false,
  }) : _variant = _Variant.secondary;

  const Button.destructive({
    super.key,
    required this.label,
    required this.onPressed,
    this.isLoading = false,
    this.loadingLabel,
    this.icon,
    this.iconPosition = ButtonIconPosition.leading,
    this.fullWidth = false,
  }) : _variant = _Variant.destructive;

  const Button.outline({
    super.key,
    required this.label,
    required this.onPressed,
    this.isLoading = false,
    this.loadingLabel,
    this.icon,
    this.iconPosition = ButtonIconPosition.leading,
    this.fullWidth = false,
  }) : _variant = _Variant.outline;

  const Button.ghost({
    super.key,
    required this.label,
    required this.onPressed,
    this.isLoading = false,
    this.loadingLabel,
    this.icon,
    this.iconPosition = ButtonIconPosition.leading,
    this.fullWidth = false,
  }) : _variant = _Variant.ghost;

  @override
  Widget build(BuildContext context) {
    final colors = context.color;

    Color bgColor;
    Color fgColor;
    BorderSide? borderSide;

    switch (_variant) {
      case _Variant.primary:
        bgColor = colors.primary;
        fgColor = colors.primaryForeground;
        break;
      case _Variant.secondary:
        bgColor = colors.secondary;
        fgColor = colors.secondaryForeground;
        break;
      case _Variant.destructive:
        bgColor = colors.destructive;
        fgColor = colors.destructiveForeground;
        break;
      case _Variant.outline:
        bgColor = Colors.transparent;
        fgColor = colors.foreground;
        borderSide = BorderSide(color: colors.border);
        break;
      case _Variant.ghost:
        bgColor = Colors.transparent;
        fgColor = colors.foreground;
        break;
    }

    final style = ButtonStyle(
      elevation: WidgetStateProperty.all(0),
      shadowColor: WidgetStateProperty.all(Colors.transparent),
      shape: WidgetStateProperty.all(
        StadiumBorder(side: borderSide ?? BorderSide.none),
      ),
      backgroundColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.disabled)) {
          return colors.muted;
        }
        return bgColor;
      }),
      overlayColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.pressed)) {
          return fgColor.withValues(alpha: 0.15);
        }
        if (states.contains(WidgetState.hovered)) {
          return fgColor.withValues(alpha: 0.05);
        }
        return null;
      }),
      foregroundColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.disabled) && !isLoading) {
          return colors.mutedForeground;
        }
        return fgColor;
      }),
      padding: WidgetStateProperty.all(
        const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      ),
    );

    final content = Row(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (isLoading) ...[
          SizedBox(
            width: 16,
            height: 16,
            child: CircularProgressIndicator(
              strokeWidth: 3,
              valueColor: AlwaysStoppedAnimation(colors.secondaryForeground),
            ),
          ),
          const SizedBox(width: 8),
          Text(
            loadingLabel ?? "Loading...",
            style: TextStyle(color: colors.secondaryForeground),
          ),
        ] else ...[
          if (icon != null && iconPosition == ButtonIconPosition.leading) ...[
            Icon(icon, size: 18),
            const SizedBox(width: 8),
          ],
          Text(label),
          if (icon != null && iconPosition == ButtonIconPosition.trailing) ...[
            const SizedBox(width: 8),
            Icon(icon, size: 18),
          ],
        ],
      ],
    );

    final effectiveOnPressed = isLoading ? null : onPressed;

    final button = ElevatedButton(
      onPressed: effectiveOnPressed,
      style: style,
      child: content,
    );

    // 2. Logic to expand width if fullWidth is true
    if (fullWidth) {
      return SizedBox(width: double.infinity, child: button);
    }

    return button;
  }
}
