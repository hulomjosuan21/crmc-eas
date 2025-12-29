import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import 'package:mobile/core/theme/theme_context_extensions.dart';

class EventCard extends StatefulWidget {
  const EventCard({super.key});

  @override
  State<EventCard> createState() => _EventCardState();
}

class _EventCardState extends State<EventCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  double _dragPercentage = 0.0;

  final double _dragSensitivity = 200.0;

  @override
  void initState() {
    super.initState();
    _controller =
        AnimationController(
          vsync: this,
          duration: const Duration(milliseconds: 300),
        )..addListener(() {
          setState(() {
            _dragPercentage = _controller.value;
          });
        });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onHorizontalDragUpdate(DragUpdateDetails details) {
    double delta = details.primaryDelta! / _dragSensitivity;

    setState(() {
      _dragPercentage = (_dragPercentage - delta).clamp(0.0, 1.0);
    });
  }

  void _onHorizontalDragEnd(DragEndDetails details) {
    double velocity = details.primaryVelocity ?? 0;

    if (velocity < -500) {
      _controller.forward(from: _dragPercentage);
    } else if (velocity > 500) {
      _controller.reverse(from: _dragPercentage);
    } else {
      if (_dragPercentage > 0.5) {
        _controller.forward(from: _dragPercentage);
      } else {
        _controller.reverse(from: _dragPercentage);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.color;

    return GestureDetector(
      onHorizontalDragUpdate: _onHorizontalDragUpdate,
      onHorizontalDragEnd: _onHorizontalDragEnd,
      child: Container(
        margin: const EdgeInsets.only(bottom: 20),
        height: 200,
        clipBehavior: Clip.hardEdge,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          image: const DecorationImage(
            image: NetworkImage('https://picsum.photos/800/400'),
            fit: BoxFit.cover,
          ),
        ),
        child: Stack(
          children: [
            Container(
              color: Colors.black.withValues(alpha: _dragPercentage * 0.85),
            ),
            Center(
              child: Opacity(
                opacity: _dragPercentage,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Iconsax.calendar_1,
                      color: colors.primaryForeground,
                      size: 40,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      "Oct 24, 2025",
                      style: TextStyle(
                        color: colors.primaryForeground,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      "8:00 PM",
                      style: TextStyle(
                        color: colors.primaryMutedForeground,
                        fontSize: 18,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // 3. Original Title Layer (Fades Out)
            Positioned(
              bottom: 0,
              left: 0,
              child: Opacity(
                opacity: (1.0 - _dragPercentage * 2.0).clamp(0.0, 1.0),
                child: Container(
                  width: 230,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 12,
                  ),
                  decoration: BoxDecoration(
                    color: colors.secondary,
                    borderRadius: const BorderRadius.only(
                      topRight: Radius.circular(20),
                    ),
                  ),
                  child: const SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Text(
                      "Event title here that is very long",
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ),
                ),
              ),
            ),

            Positioned(
              right: 10,
              top: 0,
              bottom: 0,
              child: Opacity(
                opacity: (1.0 - _dragPercentage).clamp(0.0, 1.0),
                child: Center(
                  child: Icon(
                    Iconsax.arrow_left_2,
                    color: colors.mutedForeground,
                    size: 24,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
