enum EventVisibilityType {
  targetOnly("target_only"),
  public("public");

  final String value;
  const EventVisibilityType(this.value);

  static EventVisibilityType fromString(String value) {
    return EventVisibilityType.values.firstWhere(
      (e) => e.value == value,
      orElse: () => EventVisibilityType.public,
    );
  }
}
