import 'package:flutter/material.dart';
import 'package:mobile/core/theme/theme_context_extensions.dart';
import 'package:mobile/core/widget/button.dart';
import 'package:mobile/core/widget/input.dart';

class SchoolLoginScreen extends StatefulWidget {
  const SchoolLoginScreen({super.key});

  @override
  State<SchoolLoginScreen> createState() => _SchoolLoginScreenState();
}

class _SchoolLoginScreenState extends State<SchoolLoginScreen> {
  bool isPending = false;
  final TextEditingController _schoolIdController = TextEditingController();

  Future<void> _handleSubmit() async {
    setState(() {
      isPending = true;
    });

    try {
      await Future.delayed(Duration(seconds: 4));
      final schoolId = _schoolIdController.text.trim();

      if (schoolId.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("Please enter your School ID"),
            backgroundColor: Colors.red,
          ),
        );
        return;
      }

      print("ID Submitted: $schoolId");
    } finally {
      setState(() {
        isPending = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.color;

    return Scaffold(
      backgroundColor: colors.background,
      body: SingleChildScrollView(
        child: Column(
          children: [
            Stack(
              children: [
                CustomPaint(
                  size: const Size(double.infinity, 300),
                  painter: HeaderWaveShadowPainter(
                    shadowColor: const Color.fromRGBO(17, 12, 46, 0.15),
                  ),
                ),

                ClipPath(
                  clipper: HeaderWaveClipper(),
                  child: Container(
                    width: double.infinity,
                    height: 300,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          colors.primary,
                          colors.primary.withValues(alpha: 0.8),
                        ],
                      ),
                    ),
                  ),
                ),

                Positioned(
                  top: 120,
                  left: 0,
                  right: 0,
                  child: Center(
                    child: Column(
                      children: [
                        Text(
                          "Hi There!",
                          style: TextStyle(
                            color: colors.primaryForeground,
                            fontSize: 32,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.2,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 40),

                  Text(
                    "Student ID",
                    style: TextStyle(
                      color: colors.foreground,
                      fontWeight: FontWeight.w500,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 8),

                  Input(
                    hint: "Enter your Student ID",
                    controller: _schoolIdController,
                  ),

                  const SizedBox(height: 24),

                  Button.primary(
                    label: "Continue",
                    onPressed: _handleSubmit,
                    fullWidth: true,
                    isLoading: isPending,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}

class HeaderWaveShadowPainter extends CustomPainter {
  final Color shadowColor;
  HeaderWaveShadowPainter({required this.shadowColor});

  @override
  void paint(Canvas canvas, Size size) {
    var path = _getWavePath(size);

    // Apply the offset from your snippet: Offset(0, 48)
    var shiftedPath = path.shift(const Offset(0, 48));

    canvas.drawPath(
      shiftedPath,
      Paint()
        ..color = shadowColor
        // Convert blurRadius 100 to Sigma (~50)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 50),
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class HeaderWaveClipper extends CustomClipper<Path> {
  @override
  Path getClip(Size size) => _getWavePath(size);

  @override
  bool shouldReclip(CustomClipper<Path> oldClipper) => false;
}

// Shared path logic
Path _getWavePath(Size size) {
  var path = Path();
  path.lineTo(0, size.height - 50);

  var firstControlPoint = Offset(size.width / 4, size.height);
  var firstEndPoint = Offset(size.width / 2.25, size.height - 30);
  path.quadraticBezierTo(
    firstControlPoint.dx,
    firstControlPoint.dy,
    firstEndPoint.dx,
    firstEndPoint.dy,
  );

  var secondControlPoint = Offset(
    size.width - (size.width / 3.25),
    size.height - 80,
  );
  var secondEndPoint = Offset(size.width, size.height - 40);
  path.quadraticBezierTo(
    secondControlPoint.dx,
    secondControlPoint.dy,
    secondEndPoint.dx,
    secondEndPoint.dy,
  );

  path.lineTo(size.width, size.height - 40);
  path.lineTo(size.width, 0);
  path.close();
  return path;
}
