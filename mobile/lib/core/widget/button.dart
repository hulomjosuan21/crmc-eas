import 'package:flutter/material.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';
import 'package:mobile/core/theme/theme_context_extensions.dart';

enum _Variant { primary, secondary, destructive, outline, ghost }

enum ButtonIconPosition { leading, trailing }

// 1. New Enum for Size Control
enum ButtonSize { sm, md }

class Button extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final _Variant _variant;

  final bool isLoading;
  final String? loadingLabel;
  final IconData? icon;
  final ButtonIconPosition iconPosition;
  final bool fullWidth;

  // 2. Add size property
  final ButtonSize size;

  const Button.primary({
    super.key,
    required this.label,
    required this.onPressed,
    this.isLoading = false,
    this.loadingLabel,
    this.icon,
    this.iconPosition = ButtonIconPosition.leading,
    this.fullWidth = false,
    this.size = ButtonSize.md, // Default to standard size
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
    this.size = ButtonSize.md,
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
    this.size = ButtonSize.md,
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
    this.size = ButtonSize.md,
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
    this.size = ButtonSize.md,
  }) : _variant = _Variant.ghost;

  @override
  Widget build(BuildContext context) {
    final colors = context.color;

    // 3. Define Size-specific styles
    final double iconSize = size == ButtonSize.sm ? 16 : 18;
    final double fontSize = size == ButtonSize.sm ? 13 : 15;

    // Small buttons get tighter vertical padding to look like a "pill"
    final EdgeInsets geometryPadding = size == ButtonSize.sm
        ? const EdgeInsets.symmetric(horizontal: 16, vertical: 8)
        : const EdgeInsets.symmetric(horizontal: 24, vertical: 14);

    Color bgColor;
    Color fgColor;
    BorderSide? borderSide;

    switch (_variant) {
      case _Variant.primary:
        bgColor = colors.primary;
        fgColor = colors.primaryForeground;
        break;
      case _Variant.secondary:
        bgColor = colors.secondary; // Usually a light grey/muted color
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
      // 4. Use the dynamic padding
      padding: WidgetStateProperty.all(geometryPadding),
      // 5. Ensure text size matches the button size
      textStyle: WidgetStateProperty.all(
        TextStyle(fontSize: fontSize, fontWeight: FontWeight.w600),
      ),
    );

    final content = Row(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (isLoading) ...[
          SizedBox(
            width: iconSize,
            height: iconSize,
            child: LoadingAnimationWidget.threeArchedCircle(
              color: colors.primaryForeground,
              size: 18,
            ),
          ),
          const SizedBox(width: 8),
          Text(loadingLabel ?? "Loading..."),
        ] else ...[
          if (icon != null && iconPosition == ButtonIconPosition.leading) ...[
            Icon(icon, size: iconSize),
            const SizedBox(width: 8),
          ],
          Text(label),
          if (icon != null && iconPosition == ButtonIconPosition.trailing) ...[
            const SizedBox(width: 8),
            Icon(icon, size: iconSize),
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

    if (fullWidth) {
      return SizedBox(width: double.infinity, child: button);
    }

    return button;
  }
}
