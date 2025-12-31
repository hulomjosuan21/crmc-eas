import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:iconsax/iconsax.dart';
import 'package:latlong2/latlong.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';
import 'package:mobile/core/theme/color_theme_extension.dart';
import 'package:mobile/core/theme/theme_context_extensions.dart'; // Keep your theme extension

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_map_cache/flutter_map_cache.dart';
import 'package:dio_cache_interceptor/dio_cache_interceptor.dart';
import 'package:http_cache_file_store/http_cache_file_store.dart';
import 'package:path_provider/path_provider.dart';

class EventScreen extends StatefulWidget {
  const EventScreen({super.key});

  @override
  State<EventScreen> createState() => _EventScreenState();
}

class _EventScreenState extends State<EventScreen> {
  bool _isMapMode = false;
  final LatLng _eventLocation = const LatLng(10.3157, 123.8854);

  // --- OFFLINE VARS ---
  Future<CacheStore>? _cacheStoreFuture;
  bool _isOffline = false;

  // Define Whole Cebu Bounds (Main island + Bantayan/Camotes)
  final LatLngBounds _cebuBounds = LatLngBounds(
    const LatLng(9.25, 123.15), // South-West (Santander side)
    const LatLng(11.45, 124.60), // North-East (Daanbantayan side)
  );

  @override
  void initState() {
    super.initState();
    // 1. Initialize the Cache Store
    _cacheStoreFuture = _initCacheStore();
    // 2. Check internet connection immediately
    _checkConnectivity();
  }

  Future<CacheStore> _initCacheStore() async {
    final dir = await getApplicationDocumentsDirectory();
    return FileCacheStore('${dir.path}/map_cache');
  }

  Future<void> _checkConnectivity() async {
    // connectivity_plus v6/v7 returns a List<ConnectivityResult>
    final List<ConnectivityResult> results = await Connectivity()
        .checkConnectivity();

    // If none of the results indicate a connection, we are offline
    // (Note: 'none' means no wifi and no mobile data)
    final bool hasNoConnection =
        results.contains(ConnectivityResult.none) && results.length == 1;

    if (hasNoConnection) {
      setState(() {
        _isOffline = true;
      });
      debugPrint("OFFLINE MODE: Defaulting to Whole Cebu View");
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.color;
    final Size screenSize = MediaQuery.of(context).size;
    final double screenWidth = screenSize.width;
    final double screenHeight = screenSize.height;
    final double statusBarHeight = MediaQuery.of(context).padding.top;
    final double appBarHeight = kToolbarHeight;
    final double totalTopBarHeight = statusBarHeight + appBarHeight;
    final double pureImageHeight = screenWidth / (4 / 3);
    final double sheetHeightPixels = screenHeight - pureImageHeight;
    final double imageModeSheetPct = (sheetHeightPixels / screenHeight).clamp(
      0.1,
      1.0,
    );
    final double mapModeMaxPixels = screenHeight - totalTopBarHeight;
    final double mapModeMaxPct = (mapModeMaxPixels / screenHeight).clamp(
      0.1,
      1.0,
    );

    return Scaffold(
      backgroundColor: colors.background,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(
            Iconsax.arrow_left_2,
            color: colors.primaryForeground,
            fontWeight: FontWeight.w600,
          ),
          onPressed: () => Navigator.of(context).maybePop(),
        ),
        title: Text(
          "Event",
          style: TextStyle(
            color: colors.primaryForeground,
            fontWeight: FontWeight.bold,
          ),
        ),
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [Colors.black.withValues(alpha: 0.8), Colors.transparent],
            ),
          ),
        ),
        actions: [
          Row(
            children: [
              Icon(
                _isMapMode ? Icons.map : Icons.image,
                color: colors.primaryForeground,
                size: 16,
              ),
              const SizedBox(width: 8),
              SwitchTheme(
                data: SwitchThemeData(
                  trackOutlineColor: WidgetStateProperty.all(
                    Colors.transparent,
                  ),
                  trackOutlineWidth: WidgetStateProperty.all(0),
                  trackColor: WidgetStateProperty.all(colors.primaryForeground),
                  thumbColor: WidgetStateProperty.resolveWith<Color>((states) {
                    if (states.contains(WidgetState.selected)) {
                      return colors.primary;
                    }
                    return colors.mutedForeground;
                  }),
                ),
                child: Switch(
                  value: _isMapMode,
                  onChanged: (value) {
                    setState(() {
                      _isMapMode = value;
                    });
                  },
                ),
              ),
              const SizedBox(width: 16),
            ],
          ),
        ],
      ),

      body: Stack(
        children: [
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            height: _isMapMode ? screenHeight : pureImageHeight + 30,
            child: _isMapMode
                ? FutureBuilder<CacheStore>(
                    future: _cacheStoreFuture,
                    builder: (context, snapshot) {
                      if (snapshot.hasData) {
                        return _buildMap(snapshot.data!);
                      }
                      return Container(
                        color: colors.background,
                        child: const Center(child: CircularProgressIndicator()),
                      );
                    },
                  )
                : _buildCoverImage(colors),
          ),

          DraggableScrollableSheet(
            key: ValueKey(_isMapMode),
            initialChildSize: _isMapMode ? 0.6 : imageModeSheetPct,
            minChildSize: _isMapMode ? 0.15 : imageModeSheetPct,
            maxChildSize: _isMapMode ? mapModeMaxPct : imageModeSheetPct,
            snap: true,
            builder: (BuildContext context, ScrollController scrollController) {
              return Container(
                decoration: BoxDecoration(
                  color: colors.background,
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(30),
                    topRight: Radius.circular(30),
                  ),
                  boxShadow: const [
                    BoxShadow(
                      color: Colors.black12,
                      blurRadius: 10,
                      offset: Offset(0, -5),
                    ),
                  ],
                ),
                child: SingleChildScrollView(
                  controller: scrollController,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Center(
                        child: Container(
                          margin: const EdgeInsets.only(top: 15, bottom: 20),
                          width: 50,
                          height: 6,
                          decoration: BoxDecoration(
                            color: colors.secondary,
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                      ),
                      Padding(
                        padding: EdgeInsets.symmetric(horizontal: 24),
                        child: Text(
                          "Title here",
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: colors.foreground,
                          ),
                        ),
                      ),
                      const SizedBox(height: 10),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        child: Text(
                          "Content here...",
                          style: TextStyle(
                            fontSize: 16,
                            color: colors.secondary,
                          ),
                        ),
                      ),
                      const SizedBox(height: 500),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildCoverImage(ColorsExtension colors) {
    return Image.network(
      'https://picsum.photos/800/600',
      fit: BoxFit.cover,
      loadingBuilder: (context, child, loadingProgress) {
        if (loadingProgress == null) return child;
        return Center(
          child: LoadingAnimationWidget.threeArchedCircle(
            color: colors.primaryForeground,
            size: 28,
          ),
        );
      },
    );
  }

  Widget _buildMap(CacheStore cacheStore) {
    return FlutterMap(
      options: MapOptions(
        initialCameraFit: _isOffline
            ? CameraFit.bounds(
                bounds: _cebuBounds,
                padding: const EdgeInsets.all(20),
              )
            : null,
        initialCenter: _isOffline
            ? const LatLng(10.3157, 123.8854)
            : _eventLocation,
        initialZoom: _isOffline ? 9.0 : 15.0,
        interactionOptions: const InteractionOptions(
          flags: InteractiveFlag.all & ~InteractiveFlag.rotate,
        ),
      ),
      children: [
        TileLayer(
          urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          userAgentPackageName: 'com.student.mobile',
          tileProvider: CachedTileProvider(
            maxStale: const Duration(days: 30),
            store: cacheStore,
          ),
        ),
        MarkerLayer(
          markers: [
            Marker(
              point: _eventLocation,
              width: 40,
              height: 40,
              child: const Icon(Icons.location_on, color: Colors.red, size: 40),
            ),
          ],
        ),
      ],
    );
  }
}
