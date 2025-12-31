import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';
import 'package:local_auth/local_auth.dart';
import 'package:local_auth_android/local_auth_android.dart';
import 'package:mobile/core/models/student_sync_model.dart';
import 'package:mobile/core/providers/student_provider.dart';
import 'package:mobile/core/theme/color_palette.dart';
import 'package:mobile/core/theme/theme_context_extensions.dart';
import 'package:mobile/screens/auth/views/manual_auth_view.dart';
import 'package:mobile/screens/auth/views/quick_auth_view.dart';
import 'package:provider/provider.dart';
import 'package:toastification/toastification.dart';

class StudentAuthScreen extends StatefulWidget {
  const StudentAuthScreen({super.key});

  @override
  State<StudentAuthScreen> createState() => _StudentAuthScreenState();
}

class _StudentAuthScreenState extends State<StudentAuthScreen> {
  final TextEditingController _idController = TextEditingController();
  final LocalAuthentication auth = LocalAuthentication();
  final _storage = GetStorage();

  bool _rememberMe = false;
  bool _canCheckBiometrics = false;

  String? _cachedSchoolId;
  String? _cachedName;
  bool _isUnlockMode = false;

  @override
  void initState() {
    super.initState();
    _initializeAuth();
  }

  Future<void> _initializeAuth() async {
    bool canCheck = false;
    try {
      canCheck =
          await auth.canCheckBiometrics || await auth.isDeviceSupported();
    } catch (e) {
      canCheck = false;
    }

    final savedId = _storage.read('last_school_id');
    final savedName = _storage.read('last_student_name');

    if (mounted) {
      setState(() {
        _canCheckBiometrics = canCheck;
        _cachedSchoolId = savedId;
        _cachedName = savedName;
        _isUnlockMode = (savedId != null && canCheck);
      });
    }
  }

  void _onRememberMeChanged(bool? val) {
    setState(() => _rememberMe = val ?? false);
  }

  void _onSwitchAccount() {
    setState(() {
      _isUnlockMode = false;
      _idController.clear();
    });
  }

  Future<void> _handleManualAuth() async {
    if (_idController.text.trim().isEmpty) {
      _showSnackbar("Required", "Please enter your School ID");
      return;
    }

    final provider = context.read<StudentProvider>();
    await provider.login(_idController.text.trim(), _rememberMe);

    if (provider.student != null) {
      _updateCache(provider.student!);
      Get.offAllNamed('/');
    } else {
      _showSnackbar("Error", "Student not found or sync failed");
    }
  }

  Future<void> _handleBiometricAuth() async {
    if (_cachedSchoolId == null) return;

    bool authenticated = false;

    try {
      authenticated = await auth.authenticate(
        localizedReason: 'Unlock to access School-EAS',
        authMessages: const [
          AndroidAuthMessages(
            signInTitle: 'Student Verification',
            cancelButton: 'Cancel',
          ),
        ],
      );
    } on PlatformException catch (e) {
      if (e.code == 'NotAvailable' ||
          e.code == 'NotEnrolled' ||
          e.code == 'UserCanceled' ||
          e.code == 'UserFallback') {
        return;
      }
      return;
    }

    if (!authenticated || !mounted) return;

    final provider = context.read<StudentProvider>();

    Get.dialog(
      Center(
        child: LoadingAnimationWidget.threeArchedCircle(
          color: ColorPalette.primary,
          size: 28,
        ),
      ),
      barrierDismissible: false,
    );

    try {
      await provider.login(_cachedSchoolId!, false);
    } finally {
      if (Get.isDialogOpen == true) {
        Get.back();
      }
    }

    if (provider.student != null) {
      Get.offAllNamed('/');
    }
  }

  void _updateCache(StudentSync student) {
    final fullName = student.firstName;
    _storage.write('last_student_name', fullName.toUpperCase());
  }

  void _showSnackbar(String title, String message) {
    if (!mounted) return;
    toastification.show(
      context: context,
      type: ToastificationType.error,
      style: ToastificationStyle.flat,
      title: Text(title),
      description: Text(message),
      padding: EdgeInsets.symmetric(vertical: 8, horizontal: 4),
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.color;
    final isDark = ThemeContext(context).isDarkMode;
    final isLoading = context.watch<StudentProvider>().isLoading;

    return AnnotatedRegion(
      value: SystemUiOverlayStyle(
        systemNavigationBarColor: colors.background,
        systemNavigationBarIconBrightness: isDark
            ? Brightness.light
            : Brightness.dark,
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: isDark ? Brightness.light : Brightness.dark,
      ),
      child: Scaffold(
        backgroundColor: colors.background,
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: 24.0,
              vertical: 40.0,
            ),
            child: _isUnlockMode
                ? QuickAuthView(
                    cachedName: _cachedName,
                    idController: _idController,
                    isLoading: isLoading,
                    rememberMe: _rememberMe,
                    onRememberMeChanged: _onRememberMeChanged,
                    onManualAuth: _handleManualAuth,
                    onBiometricAuth: _handleBiometricAuth,
                    onSwitchAccount: _onSwitchAccount,
                  )
                : ManualAuthView(
                    idController: _idController,
                    isLoading: isLoading,
                    rememberMe: _rememberMe,
                    onRememberMeChanged: _onRememberMeChanged,
                    onManualAuth: _handleManualAuth,
                    canCheckBiometrics: _canCheckBiometrics,
                    hasCachedId: _cachedSchoolId != null,
                    onBackToQuickAuth: () =>
                        setState(() => _isUnlockMode = true),
                  ),
          ),
        ),
      ),
    );
  }
}
