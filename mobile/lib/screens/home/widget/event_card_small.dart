import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';
import 'package:mobile/core/theme/theme_context_extensions.dart';
import 'package:mobile/screens/event/event_screen.dart';

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

  // 1. Add loading state
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 250),
    );

    _fadeAnimation = CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOut,
    );

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

  // 2. Handle Tap Logic
  Future<void> _handleTap() async {
    // If interaction is locked or loading, do nothing
    if (_isLoading) return;

    // Logic: If the "peek" overlay is showing, tap simply closes it.
    // Otherwise, tap navigates.
    if (_controller.isCompleted || _controller.value > 0.5) {
      _controller.reverse();
      return;
    }

    setState(() {
      _isLoading = true;
    });

    // Simulate network delay
    await Future.delayed(const Duration(seconds: 1));

    if (!mounted) return;

    setState(() {
      _isLoading = false;
    });

    Navigator.of(
      context,
    ).push(MaterialPageRoute(builder: (context) => const EventScreen()));
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.color;

    return GestureDetector(
      onLongPress: () {
        if (!_isLoading) _controller.forward();
      },
      onTap: _handleTap, // Connected to our handler
      child: Container(
        width: 140,
        height: 140, // Ensure height is constrained if not by parent
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
            // Layer 1: Gradient and Title
            Positioned.fill(
              child: FadeTransition(
                opacity: _titleFadeOut,
                child: Stack(
                  children: [
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
                    if (!_isLoading)
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

            Positioned.fill(
              child: FadeTransition(
                opacity: _fadeAnimation,
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

            if (_isLoading)
              Positioned.fill(
                child: Container(
                  color: Colors.black.withValues(alpha: 0.85),
                  child: Center(
                    child: LoadingAnimationWidget.threeArchedCircle(
                      color: colors.primaryForeground,
                      size: 28,
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
