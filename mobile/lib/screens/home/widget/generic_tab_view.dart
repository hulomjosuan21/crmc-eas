import 'package:flutter/material.dart';

class GenericTabView extends StatelessWidget {
  final Widget child;
  final Future<void> Function() onRefresh;
  final Color indicatorColor;

  const GenericTabView({
    super.key,
    required this.child,
    required this.onRefresh,
    required this.indicatorColor,
  });

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: onRefresh,
      color: indicatorColor,
      child: child,
    );
  }
}
