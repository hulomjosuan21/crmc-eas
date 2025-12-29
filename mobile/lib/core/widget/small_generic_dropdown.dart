import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';

class SmallGenericDropdown<T> extends StatelessWidget {
  final T value;
  final List<GenericDropdownItem<T>> items;
  final ValueChanged<T?> onChanged;
  final Color backgroundColor;
  final Color foregroundColor;

  const SmallGenericDropdown({
    super.key,
    required this.value,
    required this.items,
    required this.onChanged,
    required this.backgroundColor,
    required this.foregroundColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 32,
      padding: const EdgeInsets.symmetric(horizontal: 8),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: backgroundColor),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<T>(
          value: value,
          elevation: 14,
          isDense: true,
          borderRadius: BorderRadius.circular(12),
          icon: Icon(
            Iconsax.arrow_down_1,
            color: foregroundColor,
            fontWeight: FontWeight.w600,
            size: 12,
          ),
          style: TextStyle(
            color: foregroundColor,
            fontWeight: FontWeight.w600,
            fontSize: 10,
          ),
          dropdownColor: backgroundColor,
          onChanged: onChanged,
          items: items.map((item) {
            return DropdownMenuItem<T>(
              value: item.value,
              child: Text(item.label),
            );
          }).toList(),
        ),
      ),
    );
  }
}

class GenericDropdownItem<T> {
  final T value;
  final String label;

  GenericDropdownItem({required this.value, required this.label});
}
