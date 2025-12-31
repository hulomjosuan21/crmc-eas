import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';
import 'package:iconsax/iconsax.dart';

class AutoClearAvatar extends StatefulWidget {
  final String imageUrl;
  final dynamic colors; // Passing your theme colors

  const AutoClearAvatar({
    super.key,
    required this.imageUrl,
    required this.colors,
  });

  @override
  State<AutoClearAvatar> createState() => _AutoClearAvatarState();
}

class _AutoClearAvatarState extends State<AutoClearAvatar> {
  @override
  void didUpdateWidget(covariant AutoClearAvatar oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.imageUrl != widget.imageUrl) {
      CachedNetworkImage.evictFromCache(oldWidget.imageUrl);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(2.5),
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: widget.colors.border, width: 1),
      ),
      child: CachedNetworkImage(
        imageUrl: widget.imageUrl,
        imageBuilder: (context, imageProvider) => CircleAvatar(
          radius: 35,
          backgroundColor: widget.colors.secondary,
          backgroundImage: imageProvider,
        ),
        placeholder: (context, url) => CircleAvatar(
          radius: 35,
          backgroundColor: widget.colors.secondary,
          child: LoadingAnimationWidget.threeArchedCircle(
            color: widget.colors.primary,
            size: 18,
          ),
        ),
        errorWidget: (context, url, error) => CircleAvatar(
          radius: 35,
          backgroundColor: widget.colors.secondary,
          child: Icon(
            Iconsax.warning_2,
            fontWeight: FontWeight.w600,
            color: widget.colors.destructive,
          ),
        ),
      ),
    );
  }
}
