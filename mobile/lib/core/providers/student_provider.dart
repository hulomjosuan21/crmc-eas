import 'package:flutter/material.dart';
import 'package:mobile/core/models/student_sync_model.dart';
import 'package:mobile/core/repositories/student_repo.dart';

class StudentProvider extends ChangeNotifier {
  final StudentRepository _repository;

  StudentSync? _student;
  bool _isLoading = false;

  StudentProvider(this._repository);

  StudentSync? get student => _student;
  bool get isLoading => _isLoading;

  Future<void> loadStudentData(String schoolId) async {
    // STEP 1: INSTANT LOAD (Offline First)
    // We check the cache immediately so the user sees data instantly.
    final cached = _repository.getCachedStudentOnly();

    if (cached != null) {
      _student = cached;
      notifyListeners(); // The UI updates HERE (0ms latency)
    } else {
      // Only show a loading spinner if we have absolutely no data (First time user)
      _isLoading = true;
      notifyListeners();
    }

    // STEP 2: BACKGROUND SYNC (Network)
    try {
      final freshData = await _repository.syncAndGetStudent(schoolId);

      if (freshData != null) {
        // If the server gave us new data, update the UI again
        _student = freshData;
        notifyListeners();
      }
    } catch (e) {
      print("Background sync error: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
