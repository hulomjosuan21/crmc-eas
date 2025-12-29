import 'package:mobile/core/models/student_model.dart';

class DepartmentStudentSync {
  final String departmentName;
  final String departmentCode;

  DepartmentStudentSync({
    required this.departmentName,
    required this.departmentCode,
  });

  factory DepartmentStudentSync.fromMap(Map<String, dynamic> map) {
    return DepartmentStudentSync(
      departmentName: map['departmentName'],
      departmentCode: map['departmentCode'],
    );
  }
}

class ProgramStudentSync {
  final String programName;

  ProgramStudentSync({required this.programName});

  factory ProgramStudentSync.fromMap(Map<String, dynamic> map) {
    return ProgramStudentSync(programName: map['programName']);
  }
}

class StudentSync extends Student {
  final DepartmentStudentSync department;
  final ProgramStudentSync program;

  StudentSync({
    required super.studentId,
    required super.studentSchoolId,
    required super.firstName,
    required super.lastName,
    required super.studentImage,
    required super.departmentId,
    required super.programId,
    required super.studentCreatedAt,
    required super.studentUpdatedAt,
    required this.department,
    required this.program,
  });

  factory StudentSync.fromMap(Map<String, dynamic> map) {
    return StudentSync(
      studentId: map['studentId'],
      studentSchoolId: map['studentSchoolId'],
      firstName: map['firstName'],
      lastName: map['lastName'],
      studentImage: map['studentImage'],
      departmentId: map['departmentId'],
      programId: map['programId'],
      studentCreatedAt: map['studentCreatedAt'],
      studentUpdatedAt: map['studentUpdatedAt'],
      department: DepartmentStudentSync.fromMap(
        Map<String, dynamic>.from(map['department']),
      ),
      program: ProgramStudentSync.fromMap(
        Map<String, dynamic>.from(map['program']),
      ),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'studentId': studentId,
      'studentSchoolId': studentSchoolId,
      'firstName': firstName,
      'lastName': lastName,
      'studentImage': studentImage,
      'departmentId': departmentId,
      'programId': programId,
      'studentCreatedAt': studentCreatedAt,
      'studentUpdatedAt': studentUpdatedAt,
      'department': {
        'departmentName': department.departmentName,
        'departmentCode': department.departmentCode,
      },
      'program': {'programName': program.programName},
    };
  }
}
