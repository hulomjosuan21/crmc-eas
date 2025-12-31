class EventSchedule {
  final String eventScheduleId;
  final String eventId;
  final String eventScheduleLabel;
  final DateTime eventScheduleStartAt;
  final DateTime eventScheduleEendAt;

  EventSchedule({
    required this.eventScheduleId,
    required this.eventId,
    required this.eventScheduleLabel,
    required this.eventScheduleStartAt,
    required this.eventScheduleEendAt,
  });
}
