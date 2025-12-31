import 'package:hive/hive.dart';
import 'package:mobile/core/models/student_sync_model.dart';
import 'package:mobile/core/network/dio_client.dart';
import 'package:mobile/utils/logger.dart';

class StudentService {
  final Box _box = Hive.box('student_cache');
  Future<StudentSync?> syncAndGetStudent(String schoolId) async {
    try {
      final api = DioClient();
      final response = await api.post('/student/sync/$schoolId');

      if (response.statusCode == 200) {
        final payload = response.data['payload'];
        await _box.put('cached_student', payload);
        return StudentSync.fromMap(Map<String, dynamic>.from(payload));
      }
    } catch (e) {
      logger.i("Network sync failed: $e. Falling back to cache.");
      return getCachedStudent();
    }
    return null;
  }

  StudentSync? getCachedStudent() {
    final rawData = _box.get('cached_student');
    if (rawData == null) return null;

    try {
      final Map<String, dynamic> cleanData = Map<String, dynamic>.from(
        rawData as Map,
      );

      return StudentSync.fromMap(cleanData);
    } catch (_) {
      return null;
    }
  }
}
