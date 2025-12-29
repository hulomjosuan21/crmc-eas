import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import 'package:mobile/core/theme/theme_context_extensions.dart';

class EventCardSmall extends StatefulWidget {
  final String imageUrl;
  final String title;

  const EventCardSmall({
    super.key,
    this.imageUrl = 'https://picsum.photos/300/300',
    this.title = "Event Name",
  });

  @override
  State<EventCardSmall> createState() => _EventCardSmallState();
}

class _EventCardSmallState extends State<EventCardSmall>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;
  late Animation<double> _titleFadeOut;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 250), // Fast snap effect
    );

    // Animation for the Dark Overlay + Date (0.0 to 1.0)
    _fadeAnimation = CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOut,
    );

    // Animation to hide the original Title (1.0 to 0.0)
    _titleFadeOut = Tween<double>(
      begin: 1.0,
      end: 0.0,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeIn));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.color;

    return GestureDetector(
      onLongPress: () {
        _controller.forward();
      },
      onTap: () {
        if (_controller.isCompleted || _controller.isAnimating) {
          _controller.reverse();
        } else {
          // tap action (like navigation)
        }
      },
      child: Container(
        width: 140,
        // Ensure clipBehavior is set so the overlay respects the border radius
        clipBehavior: Clip.hardEdge,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          image: DecorationImage(
            image: NetworkImage(widget.imageUrl),
            fit: BoxFit.cover,
          ),
        ),
        child: Stack(
          children: [
            Positioned.fill(
              child: FadeTransition(
                opacity: _titleFadeOut, // Fades OUT when long pressed
                child: Stack(
                  children: [
                    // Gradient
                    Positioned.fill(
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(16),
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.transparent,
                              Colors.black.withValues(alpha: 0.7),
                            ],
                            stops: const [0.6, 1.0],
                          ),
                        ),
                      ),
                    ),
                    // Title Text
                    Positioned(
                      bottom: 12,
                      left: 12,
                      right: 12,
                      child: Text(
                        widget.title,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          color: colors.primaryForeground,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // --- Layer B: Dark Overlay & Date (Hidden by default) ---
            Positioned.fill(
              child: FadeTransition(
                opacity: _fadeAnimation, // Fades IN when long pressed
                child: Container(
                  color: Colors.black.withValues(alpha: 0.85),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Iconsax.calendar_1,
                        color: colors.primaryForeground,
                        size: 24,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        "Oct 24",
                        style: TextStyle(
                          color: colors.primaryForeground,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        "8:00 PM",
                        style: TextStyle(
                          color: colors.primaryMutedForeground,
                          fontSize: 12,
                        ),
                      ),
                    ],
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
