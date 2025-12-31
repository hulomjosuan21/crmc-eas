import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:mobile/core/theme/color_theme_extension.dart';

class QrCode extends StatelessWidget {
  final String studentSchoolId;
  final String deptCode;
  final ColorsExtension colors;
  final double size;

  const QrCode({
    super.key,
    required this.studentSchoolId,
    required this.deptCode,
    required this.colors,
    this.size = 200.0,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: size,
          height: size,

          alignment: Alignment.center,
          child: Stack(
            alignment: Alignment.center,
            children: [_buildGradientQr(), _buildCenterDeptLabel()],
          ),
        ),
        const SizedBox(height: 12),
        _buildScanMeLabel(),
      ],
    );
  }

  Widget _buildGradientQr() {
    final qrSize = size - 24;
    return ShaderMask(
      shaderCallback: (bounds) {
        return LinearGradient(
          colors: [colors.primary, colors.ring],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ).createShader(bounds);
      },
      blendMode: BlendMode.srcIn,
      child: QrImageView(
        data: studentSchoolId,
        version: QrVersions.auto,
        size: qrSize,
        gapless: true,
        errorCorrectionLevel: QrErrorCorrectLevel.H,
        eyeStyle: QrEyeStyle(
          eyeShape: QrEyeShape.square,
          color: colors.primaryForeground,
        ),
        dataModuleStyle: QrDataModuleStyle(
          dataModuleShape: QrDataModuleShape.circle,
          color: colors.primaryForeground,
        ),
      ),
    );
  }

  Widget _buildCenterDeptLabel() {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [colors.primary, colors.ring],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(8),
      ),
      padding: const EdgeInsets.all(2.5),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: colors.secondary,
          borderRadius: BorderRadius.circular(5.5),
        ),
        child: Text(
          deptCode,
          style: TextStyle(
            color: colors.primary,
            fontWeight: FontWeight.bold,
            fontSize: size * 0.08,
          ),
        ),
      ),
    );
  }

  Widget _buildScanMeLabel() {
    return Text(
      "SCAN ME",
      style: TextStyle(
        color: colors.mutedForeground,
        fontSize: 12,
        fontWeight: FontWeight.bold,
        letterSpacing: 3.0,
      ),
    );
  }
}
