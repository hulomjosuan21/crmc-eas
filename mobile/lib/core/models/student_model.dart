class Student {
  final String studentId;
  final String studentSchoolId;
  final String firstName;
  final String lastName;
  final String? studentImage;
  final String departmentId;
  final String programId;
  final String studentCreatedAt;
  final String studentUpdatedAt;

  Student({
    required this.studentId,
    required this.studentSchoolId,
    required this.firstName,
    required this.lastName,
    this.studentImage,
    required this.departmentId,
    required this.programId,
    required this.studentCreatedAt,
    required this.studentUpdatedAt,
  });

  factory Student.fromMap(Map<String, dynamic> map) {
    return Student(
      studentId: map['studentId'],
      studentSchoolId: map['studentSchoolId'],
      firstName: map['firstName'],
      lastName: map['lastName'],
      studentImage: map['studentImage'],
      departmentId: map['departmentId'],
      programId: map['programId'],
      studentCreatedAt: map['studentCreatedAt'],
      studentUpdatedAt: map['studentUpdatedAt'],
    );
  }
}
