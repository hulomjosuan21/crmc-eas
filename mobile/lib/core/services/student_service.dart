import 'package:hive/hive.dart';
import 'package:mobile/core/models/student_sync_model.dart';
import 'package:mobile/core/network/dio_client.dart';
import 'package:mobile/utils/logger.dart';

class StudentRepository {
  // Access the box directly since we opened it in main.dart
  final Box _box = Hive.box('student_cache');

  /// 1. SYNC: Fetches from API -> Saves to Hive -> Returns Model
  Future<StudentSync?> syncAndGetStudent(String schoolId) async {
    try {
      final api = DioClient();
      final response = await api.post('/student/sync/$schoolId');

      if (response.statusCode == 200) {
        final payload = response.data['payload'];

        // Save the raw JSON payload to Hive for offline use
        await _box.put('current_user', payload);

        // Return the fresh data
        // We use Map<String, dynamic>.from just to be safe even with network data
        return StudentSync.fromMap(Map<String, dynamic>.from(payload));
      }
    } catch (e) {
      logger.i("Network sync failed: $e. Falling back to cache.");
      return getCachedStudentOnly();
    }
    return null;
  }

  /// 2. CACHE: Gets data ONLY from Hive (No network call)
  StudentSync? getCachedStudentOnly() {
    final rawData = _box.get('current_user');
    if (rawData == null) return null;

    try {
      // CRITICAL FIX: Hive returns Map<dynamic, dynamic>.
      // We must cast it to Map<String, dynamic> before passing to the model.
      final Map<String, dynamic> cleanData = Map<String, dynamic>.from(
        rawData as Map,
      );

      return StudentSync.fromMap(cleanData);
    } catch (e) {
      print("Cache parsing error: $e");
      return null;
    }
  }
}
