import 'package:flutter/material.dart';
import 'event_card_small.dart';

class FeaturedEventsList extends StatelessWidget {
  const FeaturedEventsList({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 140,
      margin: const EdgeInsets.symmetric(vertical: 12),
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 20),
        itemCount: 5,
        separatorBuilder: (_, __) => const SizedBox(width: 12),
        itemBuilder: (context, index) {
          return EventCardSmall(
            title: "Featured Event $index",
            imageUrl: 'https://picsum.photos/300/300?random=$index',
          );
        },
      ),
    );
  }
}
