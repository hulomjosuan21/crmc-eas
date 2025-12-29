import 'package:flutter/material.dart';

class StyledSectionHeader extends StatelessWidget {
  final String title;
  final Color foregroundColor;
  final Color accentColor;

  const StyledSectionHeader({
    super.key,
    required this.title,
    this.foregroundColor = Colors.black,
    this.accentColor = Colors.blue,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: foregroundColor,
          ),
        ),
        const SizedBox(height: 4),
        Container(
          height: 3,
          width: 24,
          decoration: BoxDecoration(
            color: accentColor,
            borderRadius: BorderRadius.circular(2),
          ),
        ),
      ],
    );
  }
}
