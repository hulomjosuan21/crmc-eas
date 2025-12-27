import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:mobile/core/theme/theme_context_extensions.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Home"), centerTitle: true),
      body: QRView(data: "202200611"),
    );
  }
}

class QRView extends StatelessWidget {
  final String data;

  const QRView({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    // 1. Get your custom colors from the Theme
    final colors = context.color;

    return Center(
      child: Container(
        // 2. "Rounded-md" container style
        decoration: BoxDecoration(
          color: colors.card, // Use card background color
          borderRadius: BorderRadius.circular(
            8.0,
          ), // "md" usually implies ~6-8px
          border: Border.all(
            color: colors.border,
            width: 1,
          ), // Optional: subtle border
          boxShadow: [
            BoxShadow(
              color: colors.foreground.withValues(alpha: 0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        padding: const EdgeInsets.all(20.0),
        child: QrImageView(
          data: data,
          version: QrVersions.auto,
          size: 300.0,
          backgroundColor: Colors.transparent,

          dataModuleStyle: QrDataModuleStyle(
            dataModuleShape: QrDataModuleShape.square,
            color: colors.primary,
          ),
          eyeStyle: QrEyeStyle(
            eyeShape: QrEyeShape.square,
            color: colors.primary,
          ),

          errorCorrectionLevel: QrErrorCorrectLevel.Q,
        ),
      ),
    );
  }
}
