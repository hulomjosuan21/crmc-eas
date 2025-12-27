import socketio
import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ValidationError


class ScanInput(BaseModel):
    qrCode: str = Field(..., min_length=1)


class StudentModel(BaseModel):
    student_school_id: str
    first_name: str
    last_name: str
    program_code: str


class AttendanceLog(BaseModel):
    attendance_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    student_school_id: str
    student_name: str
    timestamp: str
    status: str = "Present"

class AttendanceNamespace(socketio.AsyncNamespace):
    fake_students_db: List[StudentModel] = [
        StudentModel(
            student_school_id=f"202200{600 + i + 1}",
            first_name=f"Student {i + 1}",
            last_name=f"Number {i + 1}",
            program_code="BSIT"
        )
        for i in range(100)
    ]

    fake_attendance_db: List[AttendanceLog] = [
        AttendanceLog(
            student_school_id=student.student_school_id,
            student_name=f"{student.first_name} {student.last_name}",
            timestamp="08:30:00 AM"
        )
        for student in fake_students_db
    ]

    async def on_connect(self, sid, environ):
        history_data = [
            {
                "attendanceId": r.attendance_id,
                "studentSchoolId": r.student_school_id,
                "studentName": r.student_name,
                "timestamp": r.timestamp,
                "status": r.status
            }
            for r in self.fake_attendance_db
        ]
        await self.emit('attendance_history', history_data, room=sid)

    async def on_disconnect(self, sid):
        print(f"❌ Scanner disconnected: {sid}")

    async def on_scan_attendance(self, sid, data):
        try:
            try:
                valid_input = ScanInput(**data)
                qr_code = valid_input.qrCode
            except ValidationError as e:
                return {
                    "status": "error",
                    "type": "invalid_format",
                    "message": "Invalid data format.",
                    "details": e.errors()
                }

            student = next((s for s in self.fake_students_db if s.student_school_id == qr_code), None)

            if not student:
                return {
                    "status": "error",
                    "type": "student_not_found",
                    "message": f"Student ID {qr_code} not found in system."
                }

            already_scanned = next((log for log in self.fake_attendance_db if log.student_school_id == qr_code), None)

            if already_scanned:
                return {
                    "status": "error",
                    "type": "already_attended",
                    "message": f"Duplicate! {student.first_name} is already present.",
                    "data": {
                        "attendanceId": already_scanned.attendance_id,
                        "studentSchoolId": already_scanned.student_school_id,
                        "studentName": already_scanned.student_name,
                        "timestamp": already_scanned.timestamp,
                        "status": already_scanned.status
                    }
                }

            new_record = AttendanceLog(
                student_school_id=student.student_school_id,
                student_name=f"{student.first_name} {student.last_name}",
                timestamp=datetime.now().strftime("%I:%M:%S %p"),
                status="Present"
            )

            self.fake_attendance_db.insert(0, new_record)

            return {
                "status": "success",
                "type": "recorded",
                "message": f"Recorded: {student.first_name} {student.last_name}",
                "data": {
                    "attendanceId": new_record.attendance_id,
                    "studentSchoolId": new_record.student_school_id,
                    "studentName": new_record.student_name,
                    "timestamp": new_record.timestamp,
                    "status": new_record.status
                }
            }

        except Exception as e:
            print(f"🔥 Server Error: {e}")
            return {
                "status": "error",
                "type": "server_error",
                "message": "An unexpected server error occurred."
            }