import 'package:flutter/material.dart';
import 'package:mobile/core/models/student_sync_model.dart';
import 'package:mobile/core/services/student_service.dart';
import 'package:get_storage/get_storage.dart';

class StudentProvider extends ChangeNotifier {
  final StudentService _service;
  final _storage = GetStorage(); // Keep this as it's used in login and getter

  StudentSync? _student;
  bool _isLoading = false;

  StudentProvider(this._service);

  StudentSync? get student => _student;
  bool get isLoading => _isLoading;

  // Getter for session status directly from storage
  bool get isSessionValid => _storage.read('stay_logged_in') ?? false;
  String? get lastSchoolId => _storage.read('last_school_id');

  Future<bool> loadStudentData(String schoolId) async {
    // 1. Check Cache BUT verify it belongs to the schoolId provided
    final cached = _service.getCachedStudent();

    if (cached != null && cached.studentSchoolId == schoolId) {
      _student = cached;
      notifyListeners();
    } else {
      // If cache belongs to someone else or is empty, show loading
      _student = null;
      _isLoading = true;
      notifyListeners();
    }

    try {
      final freshData = await _service.syncAndGetStudent(schoolId);
      if (freshData != null) {
        _student = freshData;
        return true;
      }
    } catch (e) {
      if (_student != null) return true;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
    return _student != null;
  }

  Future<void> login(String schoolId, bool rememberMe) async {
    _isLoading = true;
    notifyListeners();

    final success = await loadStudentData(schoolId);

    if (success && _student != null) {
      await _storage.write('stay_logged_in', rememberMe);
      await _storage.write('last_school_id', schoolId);

      final String fullName = "${_student!.firstName} ${_student!.lastName}";
      await _storage.write('last_student_name', fullName.toUpperCase());
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> logout() async {
    await _storage.remove('stay_logged_in');
    await _storage.remove('last_school_id');
    _student = null;
    notifyListeners();
  }
}
