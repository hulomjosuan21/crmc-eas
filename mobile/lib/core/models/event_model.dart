import 'package:mobile/core/enums/event_visibility_enum.dart';
import 'package:mobile/core/models/event_schedule_model.dart';

class Event {
  final String eventId;
  final String eventTitle;
  final String eventContent;
  final String? eventCoveImage;
  final EventVisibilityType eventVisibilityType;
  final String? eventTargetProgramId;
  final String departmentId;
  final List<EventSchedule> eventSchedules;
  final DateTime eventCreatedAt;
  final DateTime eventUpdatedAt;

  Event({
    required this.eventId,
    required this.eventTitle,
    required this.eventContent,
    this.eventCoveImage,
    this.eventTargetProgramId,
    required this.eventVisibilityType,
    required this.departmentId,
    required this.eventSchedules,
    required this.eventCreatedAt,
    required this.eventUpdatedAt,
  });
}

class EventListItem {
  final String eventId;
  final String eventTitle;
  final String? eventCoveImage;
  final EventVisibilityType eventVisibilityType;
  final List<EventSchedule> eventSchedules;

  EventListItem({
    required this.eventId,
    required this.eventTitle,
    required this.eventCoveImage,
    required this.eventVisibilityType,
    required this.eventSchedules,
  });
}
