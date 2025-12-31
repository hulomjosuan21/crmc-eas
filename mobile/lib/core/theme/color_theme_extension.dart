import 'package:flutter/material.dart';
import 'color_palette.dart';

@immutable
class ColorsExtension extends ThemeExtension<ColorsExtension> {
  final Color background;
  final Color foreground;
  final Color card;
  final Color cardForeground;
  final Color popover;
  final Color popoverForeground;
  final Color primary;
  final Color primaryForeground;
  final Color primaryMutedForeground;
  final Color secondary;
  final Color secondaryForeground;
  final Color muted;
  final Color mutedForeground;
  final Color accent;
  final Color accentForeground;
  final Color destructive;
  final Color destructiveForeground;
  final Color border;
  final Color input;
  final Color ring;

  const ColorsExtension({
    required this.background,
    required this.foreground,
    required this.card,
    required this.cardForeground,
    required this.popover,
    required this.popoverForeground,
    required this.primary,
    required this.primaryForeground,
    required this.primaryMutedForeground,
    required this.secondary,
    required this.secondaryForeground,
    required this.muted,
    required this.mutedForeground,
    required this.accent,
    required this.accentForeground,
    required this.destructive,
    required this.destructiveForeground,
    required this.border,
    required this.input,
    required this.ring,
  });

  static const light = ColorsExtension(
    background: ColorPalette.white,
    foreground: ColorPalette.neutral950,
    card: ColorPalette.neutral100,
    cardForeground: ColorPalette.neutral950,
    popover: ColorPalette.white,
    popoverForeground: ColorPalette.neutral950,
    primaryMutedForeground: ColorPalette.neutral500,
    primary: ColorPalette.primary,
    primaryForeground: ColorPalette.white,
    secondary: ColorPalette.neutral100,
    secondaryForeground: ColorPalette.neutral900,
    muted: ColorPalette.neutral100,
    mutedForeground: ColorPalette.neutral500,
    accent: ColorPalette.neutral100,
    accentForeground: ColorPalette.neutral900,
    destructive: ColorPalette.red500,
    destructiveForeground: ColorPalette.white,
    border: ColorPalette.neutral200,
    input: ColorPalette.neutral200,
    ring: ColorPalette.neutral950,
  );

  static const dark = ColorsExtension(
    background: ColorPalette.neutral950,
    foreground: ColorPalette.neutral50,
    card: ColorPalette.neutral900,
    cardForeground: ColorPalette.neutral50,
    popover: ColorPalette.neutral950,
    popoverForeground: ColorPalette.neutral50,
    primary: ColorPalette.primary,
    primaryForeground: ColorPalette.white,
    primaryMutedForeground: ColorPalette.neutral500,
    secondary: ColorPalette.neutral800,
    secondaryForeground: ColorPalette.neutral50,
    muted: ColorPalette.neutral800,
    mutedForeground: ColorPalette.neutral400,
    accent: ColorPalette.neutral800,
    accentForeground: ColorPalette.neutral50,
    destructive: ColorPalette.red600,
    destructiveForeground: ColorPalette.neutral50,
    border: ColorPalette.neutral800,
    input: ColorPalette.neutral800,
    ring: ColorPalette.neutral300,
  );

  @override
  ThemeExtension<ColorsExtension> copyWith({
    Color? background,
    Color? foreground,
    Color? card,
    Color? cardForeground,
    Color? popover,
    Color? popoverForeground,
    Color? primary,
    Color? primaryForeground,
    Color? secondary,
    Color? secondaryForeground,
    Color? muted,
    Color? mutedForeground,
    Color? accent,
    Color? accentForeground,
    Color? destructive,
    Color? destructiveForeground,
    Color? border,
    Color? input,
    Color? ring,
  }) {
    return ColorsExtension(
      background: background ?? this.background,
      foreground: foreground ?? this.foreground,
      card: card ?? this.card,
      cardForeground: cardForeground ?? this.cardForeground,
      popover: popover ?? this.popover,
      popoverForeground: popoverForeground ?? this.popoverForeground,
      primary: primary ?? this.primary,
      primaryForeground: primaryForeground ?? this.primaryForeground,
      primaryMutedForeground: primaryMutedForeground,
      secondary: secondary ?? this.secondary,
      secondaryForeground: secondaryForeground ?? this.secondaryForeground,
      muted: muted ?? this.muted,
      mutedForeground: mutedForeground ?? this.mutedForeground,
      accent: accent ?? this.accent,
      accentForeground: accentForeground ?? this.accentForeground,
      destructive: destructive ?? this.destructive,
      destructiveForeground:
          destructiveForeground ?? this.destructiveForeground,
      border: border ?? this.border,
      input: input ?? this.input,
      ring: ring ?? this.ring,
    );
  }

  @override
  ThemeExtension<ColorsExtension> lerp(
    ThemeExtension<ColorsExtension>? other,
    double t,
  ) {
    if (other is! ColorsExtension) return this;
    return ColorsExtension(
      background: Color.lerp(background, other.background, t)!,
      foreground: Color.lerp(foreground, other.foreground, t)!,
      card: Color.lerp(card, other.card, t)!,
      cardForeground: Color.lerp(cardForeground, other.cardForeground, t)!,
      popover: Color.lerp(popover, other.popover, t)!,
      popoverForeground: Color.lerp(
        popoverForeground,
        other.popoverForeground,
        t,
      )!,
      primary: Color.lerp(primary, other.primary, t)!,
      primaryForeground: Color.lerp(
        primaryForeground,
        other.primaryForeground,
        t,
      )!,
      primaryMutedForeground: Color.lerp(
        primaryMutedForeground,
        other.primaryMutedForeground,
        t,
      )!,
      secondary: Color.lerp(secondary, other.secondary, t)!,
      secondaryForeground: Color.lerp(
        secondaryForeground,
        other.secondaryForeground,
        t,
      )!,
      muted: Color.lerp(muted, other.muted, t)!,
      mutedForeground: Color.lerp(mutedForeground, other.mutedForeground, t)!,
      accent: Color.lerp(accent, other.accent, t)!,
      accentForeground: Color.lerp(
        accentForeground,
        other.accentForeground,
        t,
      )!,
      destructive: Color.lerp(destructive, other.destructive, t)!,
      destructiveForeground: Color.lerp(
        destructiveForeground,
        other.destructiveForeground,
        t,
      )!,
      border: Color.lerp(border, other.border, t)!,
      input: Color.lerp(input, other.input, t)!,
      ring: Color.lerp(ring, other.ring, t)!,
    );
  }
}
