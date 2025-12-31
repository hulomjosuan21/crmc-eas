import 'package:flutter/material.dart';
import 'package:mobile/core/theme/theme_context_extensions.dart';
import 'package:mobile/core/widget/qr_code.dart';

class QrTab extends StatelessWidget {
  const QrTab({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = context.color;
    return SingleChildScrollView(
      padding: EdgeInsets.symmetric(vertical: 24, horizontal: 12),
      child: QrCode(
        studentSchoolId: "202200611",
        deptCode: "CCS",
        colors: colors,
        size: 350.0,
      ),
    );
  }
}
